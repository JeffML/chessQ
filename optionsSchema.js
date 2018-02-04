const typeDefs = `
  enum eEngineState {
    CREATED
    INITIALIZED
    READY
    RUNNING
    STOPPED
  }

  type EngineResponse {
    engineId: String!
    state: eEngineState!
  }

  type UciIdentity {
    name: String!
    author: String!
  }

  interface Option {
    name: String!
    type: String!
  }

  type SpinOption implements Option {
    name: String!
    type: String!
    value: Int!
    min: Int!
    max: Int!
  }

  type ButtonOption implements Option {
    name: String!
    type: String!
  }

  type CheckOption implements Option {
    name: String!
    type: String!
    value: Boolean!
  }

  type ComboOption implements Option {
    name: String!
    type: String!
    value: String!
    options: [String!]!
  }

  type UciResponse {
    identity: UciIdentity!
    options : [Option]
    uciokay : Boolean!
  }
`
export default[typeDefs]
