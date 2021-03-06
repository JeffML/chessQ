import { capitalize } from 'lodash';
import validateFEN from 'fen-validator';
import Engine, { BEFORE_ISREADY } from './Engine';


function parseGo(response) {
  // attempts to parse the bestmove response; unparsed tokens
  // are also returned, in order of response
  const tokens = response.slice(-1)[0].split(' ');

  function getResponse(name, numVals = 1) {
    // grab response by name, get the values, strip from tokens;
    // remaining tokens will be 'unparsed'
    const idx = tokens.indexOf(name);
    if (idx >= 0) {
      const res = tokens.splice(idx, numVals + 1);
      return res.slice(1).join(' ');
    }
    return null;
  }

  const value = getResponse('bestmove');
  const ponder = getResponse('ponder');
  const unparsed = tokens.join(' ');

  return {
    value,
    ponder,
    unparsed,
  };
}


/* Manages engine instances */
class EnginePool {
  constructor({ length, pubsub }) {
    this.length = length;
    this.queue = {};
    this.monitorQueue();
    this.pubsub = pubsub;
    // console.log({ pubsub });
  }

  monitorQueue() {
    const isExpired = e => (new Date() - e.lastUsed) > 10 * 60 * 1000;

    const scan = () => {
      const workers = Object.entries(this.queue);
      workers.forEach((w) => {
        if (isExpired(w)) {
          this.killWorker(w);
        }
      });
    };

    this.monitor = setInterval(scan, 1000);
  }

  killWorker(w) {
    w.send('exit');
    delete this.queue[w.uuid];
  }

  killAllAndExit() {
    const workers = Object.values(this.queue);
    workers.forEach((w) => {
      this.killWorker(w);
    });
    clearInterval(this.monitor);
  }


  /* request an instance */
  requestEngine() {
    if (Object.keys(this.queue).length < this.length) {
      const worker = new Engine({ pubsub: this.pubsub });
      this.queue[worker.uuid] = worker;
      return Promise.resolve({ engineId: worker.uuid, state: 'CREATED' });
    }
    return Promise.reject(new Error('Maximum # of active engines exceeded; try again later'));
  }


  terminate(uuid) {
    const worker = this.queue[uuid];
    if (worker) {
      this.queue.killWorker(worker);
    }
  }

  async uci(uuid) {
    const worker = this.queue[uuid];
    if (!worker) {
      throw Error(`No worker found for ${uuid}`);
    }
    // console.log("uuid is", worker.uuid)
    const responses = await worker.sendAndAwait('uci', 'uciok');
    worker.status = BEFORE_ISREADY;
    worker.options = EnginePool.parseUciResponses(responses);
    // console.log('wo', worker.options);
    return worker.options;
  }


  // parse the response strings into JSON
  static parseUciResponses(responses) {
    function parseOption(arr) {
      const iType = arr.indexOf('type');
      const optionName = arr.slice(0, iType).join(' ');

      const rest = arr.slice(iType);
      const typename = `${capitalize(arr[iType + 1])}Option`;

      const optionParams = {};
      for (let i = 0; i < rest.length; i += 2) {
        optionParams[rest[i]] = rest[i + 1];
      }

      const retVal = Object.assign({
        name: optionName,
        __typename: typename,
      }, optionParams);

      if (retVal.default) {
        retVal.value = retVal.default;
      }
      return retVal;
    }

    const res = {
      identity: {},
      options: [],
    };

    responses.forEach((r) => {
      const rarr = r.split(' ');
      const [id, type] = rarr;
      const rest = rarr.slice(2);

      // console.log({id, type, rest})
      res.uciok = false;

      switch (id) {
        case 'id':
          res.identity = res.identity || {};
          res.identity[type] = rest.join(' ');
          break;
        case 'option':
          res.options.push(parseOption(rest));
          break;
        case 'uciok':
          res.uciok = true;
          break;
        default:
          break;
      }
    });

    return res;
  }

  getWorker(uuid) {
    const worker = this.queue[uuid];
    if (!worker) {
      throw Error(`No worker found for ${uuid}`);
    }
    return worker;
  }

  async setSpinOption(uuid, name, value) {
    const worker = this.getWorker(uuid);
    return worker.send(`setoption name ${name} value ${value}`);
  }

  async setButtonOption(uuid, name) {
    const worker = this.getWorker(uuid);
    return worker.send(`setoption name ${name}`);
  }

  async setCheckOption(uuid, name, value) {
    const worker = this.getWorker(uuid);
    return worker.send(`setoption name ${name} value ${value}`);
  }

  async setComboOption(uuid, name, value) {
    const worker = this.getWorker(uuid);
    return worker.send(`setoption name ${name} value ${value}`);
  }

  async newGame(uuid, fen, moves) {
    const worker = this.getWorker(uuid);
    worker.send('ucinewgame');
    if (fen !== 'startpos') {
      const valid = validateFEN(fen);
      if (!valid) {
        return ({ error: 'Invalid FEN' });
      }
    }
    if (moves) {
      return worker.send(`position ${fen} moves ${moves}`);
    }
    return worker.send(`position ${fen}`);
  }


  async isReady(uuid) {
    console.log('isReady()');
    const worker = this.queue[uuid];
    if (!worker) {
      throw Error(`No worker found for ${uuid}`);
    }

    const response = await worker.sendAndAwait('isready', 'readyok');
    // console.log('isready responded');
    const retVal = {
      info: worker.optionInfo,
      errors: worker.optionErrors,
      response: response[0],
    };
    worker.optionInfo = [];
    worker.optionErrors = [];
    return retVal;
  }

  async go(uuid, { infinite }) {
    const worker = this.getWorker(uuid);
    if (!worker) {
      throw Error(`No worker found for ${uuid}`);
    }


    if (!infinite) {
      const response = await worker.sendAndAwait('go', 'bestmove');
      // console.log({ response });
      return parseGo(response);
    }

    return worker.send('go infinite');
  }

  async stop(uuid) {
    const worker = this.getWorker(uuid);
    if (!worker) {
      throw Error(`No worker found for ${uuid}`);
    }

    const response = await worker.sendAndAwait('stop', 'bestmove');
    return parseGo(response);
  }
}

export default EnginePool;
