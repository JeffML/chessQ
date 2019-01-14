import { PubSub, withFilter } from 'apollo-server-express';
import MoveScalar from './moveScalar';
import EnginePool from './engine/EnginePool';

const pubsub = new PubSub();
const enginePool = new EnginePool({ length: 5, pubsub });

const EngineOps = id => ({
  uci: async () => enginePool.uci(id),
  setSpinOption: async ({ name, value }) => enginePool.setSpinOption(id, name, value),
  setButtonOption: async ({ name }) => enginePool.setButtonOption(id, name),
  setCheckOption: async ({ name, value }) => enginePool.setCheckOption(id, name, value),
  setComboOption: async ({ name, value }) => enginePool.setComboOption(id, name, value),
  isready: async () => enginePool.isReady(id),
  newGame: async (data) => {
    const { positionType, moves } = data;
    console.log({ positionType, moves });
    return enginePool.newGame(id, positionType, moves);
  },
  go: async () => enginePool.go(id, { infinite: false }),
  goInfinite: async () => enginePool.go(id, { infinite: true }),
  stop: async () => enginePool.stop(id),
});

const TOPIC = 'infoTopic';

export default {
  Query: {
    version: () => '0.1.0', // TODO: read from package.json
    createEngine: () => enginePool.requestEngine(),
  },
  Move: MoveScalar,
  // FIXME: info is just returning a string for now
  // Info: {
  //   __resolveType(obj, context, info) {
  //     console.log('called');
  //     return 'Score';
  //   },
  // },

  Mutation: {
    Engine: (_, { id }) => EngineOps(id),
  },
  Subscription: {
    info: {
      // subscribe: withFilter(() => pubsub.asyncIterator(TOPIC)),
      subscribe: () => pubsub.asyncIterator([TOPIC]),
    },
  },
};
