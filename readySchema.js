const typeDefs = `
  enum eEngineState {
    CREATED
    INITIALIZED
    READY
    RUNNING
    STOPPED
  }

  type Position {
    fenString: String
  }

  type EngineResponse {
    engineId: String!
    state: eEngineState!
  }

  scalar Move

  extend type Query {
    ucinewgame(engineId: String!): String!
    position(engineId: String!, position: Position, moves: [Move]): String!
  }

`
export default[typeDefs]
