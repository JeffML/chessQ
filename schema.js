import {makeExecutableSchema, addMockFunctionsToSchema} from 'graphql-tools'

import OptionsSchema from './optionsSchema'
import ReadySchema from './readySchema'

import mocks from './mocks'
import MoveScalar from './moveScalar'

import {PubSub, withFilter} from 'graphql-subscriptions';

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
    go: String!
  }

  type SomethingChanged {
    id: String!
  }

  type Subscription {
    info: SomethingChanged
  }
`]

const schema = [
  ...ChessQSchema,
  ...OptionsSchema,
  ...ReadySchema
]

const TOPIC = 'info'

const options = {
  typeDefs: schema,
  resolvers: {
    Query: {
      isready: () => "readyok", // TODO: mocked
    },
    Move: MoveScalar,
    Mutation: {
      go: () => {
        console.log('publishing: ', TOPIC)
        pubsub.publish(TOPIC, {
          info: {
            id: "1234"
          }
        })
        return "going..."
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
