const typeDefs = `
  enum eEngineState {
    CREATED
    INITIALIZED
    READY
    RUNNING
    STOPPED
  }

  input PositionInput {
    fenString: String
  }

  type EngineResponse {
    engineId: String!
    state: eEngineState!
  }

  scalar Move

  type Subscription {
    info: String
  }

  extend type Query {
    ucinewgame(engineId: String!): String!
    position(engineId: String!, position: PositionInput!, moves: [Move]): String!
  }
`

export default[typeDefs]
