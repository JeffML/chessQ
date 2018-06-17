import casual from 'casual';
import stockfish from 'stockfish'

/*
Worker builder
*/

const WorkerBuilder = {
    createWorker: () => {
        const worker = {
            uuid: process.env.MOCK_UUID || casual.uuid,
            engine: stockfish(),
            lastUsed: new Date(),
            beforeUci: true,
            optionSent: false,
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
            // console.log("receiving:", line)
            if (worker.beforeUci) {
                // do nothing
            } else if (worker.optionSent && line !== "readyok") {
                if (line.startsWith('info')) {
                    worker.optionInfo.push(line)
                } else {
                    worker.optionErrors.push(line)
                }
            } else {
                worker.optionSent = false;
                worker.responseStack.push(line)
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