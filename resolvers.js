import MoveScalar from './moveScalar'
import casual from 'casual'
import {PubSub, withFilter} from 'graphql-subscriptions';
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
    if (Object.keys(this.queue) < this.length) {
      const worker = {
        uuid: casual.uuid,
        engine: stockfish(),
        lastUsed: new Date()
      }

      worker.responseStack = [];

      worker.getResponse = async function() {
        return new Promise(resolve => {
          const itvl = setInterval(function() {
            if (worker.responseStack.length !== 0) {
              resolve(worker.responseStack.shift())
              clearInterval(itvl)
            }
          }, 200)
        })
      }

      worker.engine.onmessage = function(line) {
        console.log("receiving:", line)
        worker.responseStack.push(line)
      }

      worker.sendAndAwait = async function(message) {
        console.log("posting:", message)
        worker.engine.postMessage(message)
        return await worker.getResponse();
      }

      this.queue[worker.uuid] = worker;
      return Promise.resolve({engineId: worker.uuid, state: "CREATED"})
    } else {
      return Promise.reject(new Error("Maximum # of active engines exceeded; try again later"))
    }
  }

  async uci(uuid) {
    var resp = await this.queue[uuid].sendAndAwait("uci")
    console.log({resp})
    return {
      identity: {
        name: "moop",
        author: 'flum!'
      }
    };
  }
}

const engineQueue = new EngineQueue({length: 5});

const EngineOps = (id) => ({
  uci: async () => await engineQueue.uci(id),
  isready: () => "readyok", // TODO: mocked
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
