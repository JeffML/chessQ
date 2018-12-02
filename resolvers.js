import { PubSub, withFilter } from 'apollo-server-express';
import MoveScalar from './moveScalar';
import EngineQueue from './engine/queue';

const pubsub = new PubSub();
const engineQueue = new EngineQueue({ length: 5, pubsub });

const EngineOps = id => ({
  uci: async () => engineQueue.uci(id),
  setSpinOption: async ({ name, value }) => engineQueue.setSpinOption(id, name, value),
  setButtonOption: async ({ name }) => engineQueue.setButtonOption(id, name),
  setCheckOption: async ({ name, value }) => engineQueue.setCheckOption(id, name, value),
  setComboOption: async ({ name, value }) => engineQueue.setComboOption(id, name, value),
  isready: async () => engineQueue.isReady(id),
  newGame: async (data) => {
    const { positionType, moves } = data;
    console.log({ positionType, moves });
    return engineQueue.newGame(id, positionType, moves);
  },
  go: async () => engineQueue.go(id, { infinite: false }),
  goInfinite: async () => engineQueue.go(id, { infinite: true }),
  stop: async () => engineQueue.stop(id),
});

const TOPIC = 'info';

export default {
  Query: {
    version: () => '0.1.0', // TODO: read from package.json
    createEngine: () => engineQueue.requestEngine(),
  },
  Move: MoveScalar,
  Info: {
    __resolveType(obj, context, info) {
      console.log('called');
      return 'Score';
    },
  },

  Mutation: {
    Engine: (_, { id }) => EngineOps(id),
  },
  Subscription: {
    info: {
      subscribe: withFilter(() => pubsub.asyncIterator(TOPIC), (payload, variables) => true),
    },
  },
};
