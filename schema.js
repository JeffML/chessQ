import { makeExecutableSchema } from 'graphql-tools';

import OptionsSchema from './optionsSchema';
import ReadySchema from './readySchema';

import resolvers from './resolvers';

const ChessQSchema = [
  `
  type Query {
    version: String!
    createEngine: EngineResponse
  }

  type Mutation {
    Engine(id: String!) : EngineOps
  }

  type EngineOps {
    uci: UciResponse!
    register(name: String, code: String): String
    registerLater: String
    setSpinOption(name: String!, value: Int!): String!
    setButtonOption(name: String!): String!
    setCheckOption(name: String!, value: Boolean!): String!
    setComboOption(name: String!, value: String!): String!
    newGame (positionType: POSITION_ENUM=startpos, moves: [Move]): String!
    quit: String!
    isready: ReadyResponse!
    go: BestMove!
    goInfinite: String!
    stop: String!
  }

  enum POSITION_ENUM {
    fen,
    startpos
  }

  type ReadyResponse {
    errors: [String]!
    info: [String]!
    response: String!
  }

  type Score {
    cp: Int!
    depth: Int!
    nodes: Int!
    time: Int!
    pv: [Move!]!
  }

  type Depth {
    depth: Int!
    seldepth: Int!
    nodes: Int
  }

  type Nps {
    value: Int!
  }

  type BestMove {
    value: Move!,
    ponder: Move
    unparsed: String
  }

  union Info = Score | Depth | Nps | BestMove

  type Subscription {
    info: Info
  }
`,
];

const typeDefs = [
  ...ChessQSchema,
  ...OptionsSchema,
  ...ReadySchema,
];

const options = {
  typeDefs,
  resolvers,
};

const executableSchema = makeExecutableSchema(options);
export default executableSchema;
export { typeDefs };
