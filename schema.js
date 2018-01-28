import {makeExecutableSchema, addMockFunctionsToSchema} from 'graphql-tools'

import PreambleSchema from './preamble'

import {mocks} from './mocks'

const JuiceSchema = [`
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
  ...JuiceSchema,
  // ...PreambleSchema

]

const options = {
  typeDefs: schema,
  resolvers: {
    Query: {
      registerLater: (_, {engineId}) => {
        return "ok"
      }
    }
  }
}

const executableSchema = makeExecutableSchema(options);
addMockFunctionsToSchema({
  schema: executableSchema,
  /* mocks: mocks */
})

export default executableSchema;
