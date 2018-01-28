import {makeExecutableSchema, addMockFunctionsToSchema} from 'graphql-tools'

import PreambleSchema from './preamble'

import mocks from './mocks'

const ChessQSchema = [`
  type Query {
    # createEngine: EngineResponse
    # uci(engineId: String!): UciResponse!
    register(engineId: String!, name: String, code: String): String
    registerLater(engineId: String!): String
  }
  schema {
    query: Query
  }
`]

const schema = [
  ...ChessQSchema,
  // ...PreambleSchema

]

const options = {
  typeDefs: schema,
  resolvers: {}
}

const executableSchema = makeExecutableSchema(options);
addMockFunctionsToSchema({schema: executableSchema, mocks})

export default executableSchema;
