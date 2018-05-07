import MoveScalar from './moveScalar'
import casual from 'casual'
import {PubSub, withFilter} from 'graphql-subscriptions';
import {capitalize} from 'lodash';
const pubsub = new PubSub();
// const stockfish = require("stockfish");
import stockfish from 'stockfish'

/* Manages engine instances */
class EngineQueue {
  constructor({length}) {
    this.length = length;
    this.queue = {}
    this.monitorQueue();
  }

  monitorQueue() {
    const isExpired = (e) => {
      return (new Date() - e.lastUsed) > 10 * 60 * 1000
    }

    const scan = () => {
      const workers = Object.entries(this.queue)
      workers.forEach(w => {
        if (isExpired(w)) {
          w.instance.terminate();
          delete queue[w.uuid]
        }
      })
    }

    setInterval(scan, 1000);
  }

  /* request an instance */
  requestEngine() {
    if (Object.keys(this.queue).length < this.length) {
      const worker = {
        uuid: process.env.MOCK_UUID
          ? "1"
          : casual.uuid,
        engine: stockfish(),
        lastUsed: new Date(),
        beforeUci: true,
        optionSent: false,
        optionErrors: []
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
          worker.optionErrors.push(line)
        } else {
          worker.responseStack.push(line)
        }
      }

      worker.sendAndAwait = async function(message, terminator) {
        // console.log("posting:", message)
        worker.engine.postMessage(message)
        const responses = [];
        var response;

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

      this.queue[worker.uuid] = worker;
      return Promise.resolve({engineId: worker.uuid, state: "CREATED"})
    } else {
      return Promise.reject(new Error("Maximum # of active engines exceeded; try again later"))
    }
  }

  async uci(uuid) {
    const worker = this.queue[uuid];
    if (!worker) {
      throw Error(`No worker found for ${uuid}`)
    }
    // console.log("uuid is", worker.uuid)
    worker.beforeUci = false;
    const responses = await worker.sendAndAwait("uci", "uciok")
    worker.options = this.parseUciResponses(responses)
    return worker.options;
  }

  // parse the response strings into JSON
  parseUciResponses(responses) {

    function parseOption(arr) {
      const iType = arr.indexOf('type');
      const optionName = arr.slice(0, iType).join(" ")

      const rest = arr.slice(iType)
      let __typename = capitalize(arr[iType + 1]) + "Option";

      const optionParams = {};
      for (let i = 0; i < rest.length; i += 2) {
        optionParams[rest[i]] = rest[i + 1]
      }

      const retVal = Object.assign({
        name: optionName,
        __typename
      }, optionParams)

      if (retVal.default) {
        retVal.value = retVal.default
      };
      return retVal
    }

    let res = {
      identity: {},
      options: []
    }

    responses.forEach(r => {
      let rarr = r.split(" ")
      const [id, type] = rarr;
      const rest = rarr.slice(2);

      // console.log({id, type, rest})

      switch (id) {
        case "id":
          res.identity = res.identity || {};
          res.identity[type] = rest.join(" ");
          break;
        case "option":
          res.options.push(parseOption(rest))
          break;
        default:
          break
      }
    });

    return res;
  }

  async setSpinOption(uuid, name, value) {
    const worker = this.queue[uuid];
    if (!worker) {
      throw Error(`No worker found for ${uuid}`)
    }

    worker.optionSent = true;
    return worker.send(`setoption name ${name} value ${value}`)
  }

  // async isReady(uuid) {
  //   return ({errors: ["foo"], response: "readyok"})
  // }

  async isReady(uuid) {
    console.log("isReady???", uuid)
    const worker = this.queue[uuid];
    if (!worker) {
      throw Error(`No worker found for ${uuid}`)
    }

    worker.optionSent = false;
    const response = await worker.sendAndAwait("isready", "readyok");
    console.log({response})

    const retVal = {
      errors: worker.optionErrors,
      response: response[0]
    }
    worker.optionErrors = []
    return retVal;
  }

}

const engineQueue = new EngineQueue({length: 5});

const EngineOps = (id) => ({
  uci: async () => await engineQueue.uci(id),
  setSpinOption: async ({name, value}) => await engineQueue.setSpinOption(id, name, value),
  isready: async () => await engineQueue.isReady(id),
  go: async () => {
    let info;
    for (info of InfoGenerator()) {
      console.log(info.__typename)
      pubsub.publish(TOPIC, {info})
      await sleep(3000)
    }
    return info;
  }
})

export default {
  Query: {
    version: () => "1.0.0", //TODO: read from package.json
    createEngine: () => engineQueue.requestEngine()
  },
  Move: MoveScalar,
  Mutation: {
    Engine: (_, {id}) => EngineOps(id)
  },
  Subscription: {
    info: {
      subscribe: withFilter(() => pubsub.asyncIterator(TOPIC), (payload, variables) => {
        return true
      })
    }
  }
}
