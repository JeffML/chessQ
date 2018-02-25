import {makeExecutableSchema, addMockFunctionsToSchema} from 'graphql-tools'

import OptionsSchema from './optionsSchema'
import ReadySchema from './readySchema'

import mocks from './mocks'
import MoveScalar from './moveScalar'

import {PubSub, withFilter} from 'graphql-subscriptions';

import InfoGenerator from './InfoGenerator'

const pubsub = new PubSub();

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
  type Mutation {
    go: BestMove!
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

const schema = [
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
  typeDefs: schema,
  resolvers: {
    Query: {
      isready: () => "readyok", // TODO: mocked
    },
    Move: MoveScalar,
    Mutation: {
      go: async () => {
        let info;
        for (info of InfoGenerator()) {
          console.log(info.__typename)
          pubsub.publish(TOPIC, {info})
          await sleep(400)
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
}

const executableSchema = makeExecutableSchema(options);
addMockFunctionsToSchema({schema: executableSchema, mocks, preserveResolvers: true})
export default executableSchema;
