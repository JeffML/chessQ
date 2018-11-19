import stockfish from 'stockfish';
import casual from 'casual';

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
  createWorker: () => {
    const worker = {
      status: BEFORE_UCI,
      uuid: process.env.MOCK_UUID || casual.uuid,
      engine: stockfish(),
      lastUsed: new Date(),
      optionErrors: [],
      optionInfo: [],
    };

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
          console.log('subscription =>', line);
          break;

        default:
          console.log({ status: worker.status, line });
          worker.responseStack.push(line);
          break;
      }
    };

    worker.sendAndAwait = async function (message, terminator) {
      const responses = [];
      let response;
      console.log('posting:', message);
      worker.engine.postMessage(message);

      do {
        response = await worker.getResponse();
        responses.push(response);
        console.log({ response });
      } while (!response.startsWith(terminator));

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
