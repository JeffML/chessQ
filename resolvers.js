import MoveScalar from './moveScalar'
import {PubSub, withFilter} from 'graphql-subscriptions';

const pubsub = new PubSub();
import EngineQueue from './engine/queue'

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
