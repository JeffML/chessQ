import { PubSub, withFilter } from 'apollo-server-express';
import MoveScalar from './moveScalar';
import EngineQueue from './engine/queue';

const pubsub = new PubSub();
const engineQueue = new EngineQueue({ length: 5 });

const EngineOps = id => ({
  uci: async () => engineQueue.uci(id),
  setSpinOption: async ({ name, value }) => engineQueue.setSpinOption(id, name, value),
  setButtonOption: async ({ name }) => engineQueue.setButtonOption(id, name),
  setCheckOption: async ({ name, value }) => engineQueue.setCheckOption(id, name, value),
  setComboOption: async ({ name, value }) => engineQueue.setComboOption(id, name, value),
  isready: async () => engineQueue.isReady(id),
  go: async () => engineQueue.go(id),
});

const TOPIC = 'info';

export default {
  Query: {
    version: () => '0.1.0', // TODO: read from package.json
    createEngine: () => engineQueue.requestEngine(),
  },
  Move: MoveScalar,
  Mutation: {
    Engine: (_, { id }) => EngineOps(id),
  },
  Subscription: {
    info: {
      subscribe: withFilter(() => pubsub.asyncIterator(TOPIC), (payload, variables) => true),
    },
  },
};
