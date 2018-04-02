import MoveScalar from './moveScalar'
import casual from 'casual'
import {PubSub, withFilter} from 'graphql-subscriptions';
const pubsub = new PubSub();
// const stockfish = require("stockfish");
import stockfish from 'stockfish'

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

  requestEngine() {
    console.log(this.length, Object.keys(this.queue).length);
    if (Object.keys(this.queue) < this.length) {

      const worker = {
        uuid: casual.uuid,
        instance: stockfish(),
        lastUsed: new Date()
      }
      console.log({worker})
      queue[worker.uuid] = worker;
      return Promise.resolve({engineId: worker.uuid, state: "CREATED"})
    } else {
      return Promise.reject(new Error("Maximum # of active engines exceeded; try again later"))
    }
  }
}

const queue = new EngineQueue({length: 5});

export default {
  Query: {
    createEngine: () => queue.requestEngine(),
    isready: () => "readyok", // TODO: mocked
  },
  Move: MoveScalar,
  Mutation: {
    go: async () => {
      let info;
      for (info of InfoGenerator()) {
        console.log(info.__typename)
        pubsub.publish(TOPIC, {info})
        await sleep(3000)
      }
      return info;
    }
  },
  Subscription: {
    info: {
      subscribe: withFilter(() => pubsub.asyncIterator(TOPIC), (payload, variables) => {
        return true
      })
    }
  }
}
