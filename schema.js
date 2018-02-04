import {makeExecutableSchema, addMockFunctionsToSchema} from 'graphql-tools'

import OptionsSchema from './optionsSchema'
import ReadySchema from './readySchema'

import mocks from './mocks'
import MoveScalar from './moveScalar'

const ChessQSchema = [`
  type Query {
    createEngine: EngineResponse
    uci(engineId: String!): UciResponse!
    register(engineId: String!, name: String, code: String): String
    registerLater(engineId: String!): String
    setSpinOption(engineId: String!, name: String!, value: Int!): String!
    setButtonOption(engineId: String!, name: String!): String!
    setCheckOption(engineId: String!, name: String!, value: Boolean!): String!
    setComboOption(engineId: String!, name: String!, value: String!): String!
    quit(engineId: String!): String!
    isready(engineId: String!): String!
  }
  schema {
    query: Query
  }
`]

const schema = [
  ...ChessQSchema,
  ...OptionsSchema,
  ...ReadySchema
]

const options = {
  typeDefs: schema,
  resolvers: {
    Query: {
      isready: () => "readyok" // TODO: mocked
    },
    Move: MoveScalar
  }
}

const executableSchema = makeExecutableSchema(options);
addMockFunctionsToSchema({schema: executableSchema, mocks, preserveResolvers: true})

export default executableSchema;
