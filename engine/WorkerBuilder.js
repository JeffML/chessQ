import casual from 'casual';
import stockfish from 'stockfish'

/*
Worker builder
*/

/* worker statuses */
const BEFORE_UCI = Symbol()
const BEFORE_ISREADY = Symbol()
const READY = Symbol()
const RUNNING = Symbol()

export { BEFORE_UCI, BEFORE_ISREADY, READY, RUNNING }

const WorkerBuilder = {
    createWorker: () => {

        const worker = {
            status: BEFORE_UCI,
            uuid: process.env.MOCK_UUID || casual.uuid,
            engine: stockfish(),
            lastUsed: new Date(),
            optionErrors: [],
            optionInfo: []
        }

        worker.responseStack = [];

        worker.getResponse = async function() {
            return new Promise(resolve => {
                const itvl = setInterval(function() {
                    if (worker.responseStack.length !== 0) {
                        resolve(worker.responseStack.shift())
                        clearInterval(itvl)
                    }
                }, 20)
            })
        }

        worker.engine.onmessage = function(line) {
            switch (worker.status) {
                case BEFORE_UCI:
                    if (line === 'uciok') {
                        worker.status = BEFORE_ISREADY
                    }
                    worker.responseStack.push(line)
                    break;
                case BEFORE_ISREADY:
                    if (line !== "readyok") {
                        if (line.startsWith('info')) {
                            worker.optionInfo.push(line)
                        } else {
                            worker.optionErrors.push(line)
                        }
                        break;
                    } else {
                        worker.status = READY
                    }

                default:
                    worker.responseStack.push(line)
                    break;
            }

        }

        worker.sendAndAwait = async function(message, terminator) {
            const responses = [];
            var response;
            console.log("posting:", message)
            worker.engine.postMessage(message)

            do {
                response = await worker.getResponse();
                responses.push(response)
            } while (response !== terminator)

            return responses;
        }

        worker.send = function(message) {
            console.log(`sending ${message}`)
            worker.engine.postMessage(message)
            return "acknowledged";
        }

        return worker;
    }

}

export default WorkerBuilder