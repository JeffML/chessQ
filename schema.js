import {makeExecutableSchema, addMockFunctionsToSchema} from 'graphql-tools'
import fs from 'fs';

import OptionsSchema from './optionsSchema'
import ReadySchema from './readySchema'

import mocks from './test/mocks'
import InfoGenerator from './InfoGenerator'
import resolvers from './resolvers'

const ChessQSchema = [`
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
    quit: String!
    isready: ReadyResponse!
    go: BestMove!
  }

  type ReadyResponse {
    errors: [String]!
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
  }

  union Info = Score | Depth | Nps | BestMove

  type Subscription {
    info: Info
  }
`]

const typeDefs = [
  ...ChessQSchema,
  ...OptionsSchema,
  ...ReadySchema
]

const TOPIC = 'info'

function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

const options = {
  typeDefs,
  resolvers
}

const executableSchema = makeExecutableSchema(options);
// addMockFunctionsToSchema({schema: executableSchema, mocks, preserveResolvers: true})
export default executableSchema;
