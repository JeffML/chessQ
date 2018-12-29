import stockfish from 'stockfish';
import uuid from 'random-uuid-v4';

/*
Worker builder
*/

/* worker statuses */
const BEFORE_UCI = Symbol('before uci');
const BEFORE_ISREADY = Symbol('before is ready');
const READY = Symbol('ready');
const RUNNING = Symbol('running');

export {
  BEFORE_UCI, BEFORE_ISREADY, READY, RUNNING,
};

const WorkerBuilder = {
  createWorker: ({ pubsub }) => {
    const worker = {
      status: BEFORE_UCI,
      uuid: process.env.MOCK_UUID || uuid(),
      engine: stockfish(),
      lastUsed: new Date(),
      optionErrors: [],
      optionInfo: [],
      pubsub,
    };

    // console.log({ worker });
    worker.responseStack = [];

    worker.getResponse = async function X() {
      return new Promise((resolve) => {
        const itvl = setInterval(() => {
          if (worker.responseStack.length !== 0) {
            resolve(worker.responseStack.shift());
            clearInterval(itvl);
          }
        }, 20);
      });
    };

    worker.engine.onmessage = function X(line) {
      switch (worker.status) {
        case BEFORE_UCI:
          if (line === 'uciok') {
            worker.status = BEFORE_ISREADY;
          }
          worker.responseStack.push(line);
          break;
        case BEFORE_ISREADY:
          if (line !== 'readyok') {
            if (line.startsWith('info')) {
              worker.optionInfo.push(line);
            } else {
              worker.optionErrors.push(line);
            }
            break;
          } else {
            worker.status = READY;
            worker.responseStack.push(line);
            break;
          }
        case RUNNING:
          if (line.startsWith('bestmove')) {
            worker.responseStack.push(line);
            worker.status = READY;
          } else {
            try {
              console.log('subscription =>| ', Date.now(), '|', line);
              worker.pubsub.publish('infoTopic', { info: line });
            } catch (e) {
              console.error(e);
            }
          }
          break;

        default:
          // console.log({ status: worker.status, line });
          worker.responseStack.push(line);
          break;
      }
    };

    worker.sendAndAwait = async function (message, terminator) {
      console.log({ message });
      const responses = [];
      let response;

      worker.engine.postMessage(message);

      do {
        // console.log('await response for ', message);
        response = await worker.getResponse();
        // console.log('responded');
        responses.push(response);
        // console.log({ response });
      } while (!response.startsWith(terminator));

      // console.log('done with loop');
      return responses;
    };

    worker.send = function (message) {
      if (message.startsWith('setoption')) {
        worker.status = BEFORE_ISREADY;
      } else if (message === 'go infinite') {
        worker.status = RUNNING;
      }

      worker.engine.postMessage(message);
      return 'acknowledged';
    };

    return worker;
  },

};

export default WorkerBuilder;
