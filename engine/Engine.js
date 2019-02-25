import stockfish from 'stockfish';
import uuid from 'random-uuid-v4';

const engines = {
  stockfish,
};

const BEFORE_UCI = Symbol('before uci');
const BEFORE_ISREADY = Symbol('before is ready');
const READY = Symbol('ready');
const RUNNING = Symbol('running');

export {
  BEFORE_UCI, BEFORE_ISREADY, READY, RUNNING,
};


class Engine {
  constructor({ pubsub, type = 'stockfish' }) {
    this.responseStack = [];


    this.status = BEFORE_UCI;
    this.uuid = process.env.MOCK_UUID || uuid();
    this.engine = engines[type]();
    this.lastUsed = new Date();
    this.optionErrors = [];
    this.optionInfo = [];
    this.pubsub = pubsub;


    this.setMessaging(this.engine);
  }

  setMessaging(engine) {
    /* eslint-disable-next-line no-param-reassign */
    engine.onmessage = (line) => {
      switch (this.status) {
        case BEFORE_UCI:
          if (line === 'uciok') {
            this.status = BEFORE_ISREADY;
          }
          this.responseStack.push(line);
          break;
        case BEFORE_ISREADY:
          if (line !== 'readyok') {
            if (line.startsWith('info')) {
              this.optionInfo.push(line);
            } else {
              this.optionErrors.push(line);
            }
            break;
          } else {
            this.status = READY;
            this.responseStack.push(line);
            break;
          }
        case RUNNING:
          if (line.startsWith('bestmove')) {
            this.responseStack.push(line);
            this.status = READY;
          } else {
            try {
              console.log('subscription =>| ', Date.now(), '|', line);
              this.pubsub.publish('infoTopic', { info: line });
            } catch (e) {
              console.error(e);
            }
          }
          break;

        default:
          // console.log({ status: worker.status, line });
          this.responseStack.push(line);
          break;
      }
    };
  }


  async getResponse() {
    return new Promise((resolve) => {
      const itvl = setInterval(() => {
        if (this.responseStack.length !== 0) {
          resolve(this.responseStack.shift());
          clearInterval(itvl);
        }
      }, 20);
    });
  }

  async sendAndAwait(message, terminator) {
    console.log({ message });
    const responses = [];
    let response;

    this.engine.postMessage(message);

    do {
      // console.log('await response for ', message);
      /* eslint-disable-next-line no-await-in-loop */
      response = await this.getResponse();
      // console.log('responded');
      responses.push(response);
      // console.log({ response });
    } while (!response.startsWith(terminator));

    // console.log('done with loop');
    return responses;
  }

  send(message) {
    if (message.startsWith('setoption')) {
      this.status = BEFORE_ISREADY;
    } else if (message === 'go infinite') {
      this.status = RUNNING;
    }

    this.engine.postMessage(message);
    return 'acknowledged';
  }
}

export default Engine;
