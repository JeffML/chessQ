# chessQ, v0.3.0

![build status](https://travis-ci.org/JeffML/chessQ.svg?branch=master)

# GraphQL API for Universal Chess Interface
This started as a mock API I wrote as a proof-of-concept for Chess.com. I found the implementation difficult because the UCI protocol is stream-based, and not designed for a call-response type API that GraphQL provides, yet I met with some success. Further work on error handling and support for other engines awaits help or ambition.

In this version, the implementation wraps an GraphQL API around an embedded stockfish engine (transpiled from original source to Javascript). Not ideal, but good for testing.

## Here are the package.json targets:
* npm run start
  * starts the GraphQL server
* npm run test
  * runs the unit tests
* other run targets are:
  * dev
    * hot server
  * mock
    * for API testing; the engine id is fixed at 1 rather than generated randomly
  * test-api
    * GraphQL API tests; server must be run in mock mode (see previous)

## The schema
I will assume some familiarity with GraphQL.  When the server is launched (`npm run start`, for example), you will see:
```
🚀 Server ready at http://localhost:3001/graphql
🚀 Subscriptions ready at ws://localhost:3001/graphql
```
Subscriptions are a GraphQL feature that allows a client to subscribe to events that are emitted form the stockfish engine wrapper. As of this writing, most of the GraphQL API is call-response, however when running analysis, _info_ strings (unparsed) are returned via subscription.

## Launching an engine and doing analysis
The tests in test-api, when run, are a good illustration of API interaction, including subscribing to info events.  If you wish to use the GraphQL "playground", then point your browser to `http://localhost:3001/graphql`.  Here are some commands to start with (mind the order of execution!):

#### get version
```
query v {version}
```

#### create an engine instance
```
query e {
  createEngine {
    engineId
    state
  }
}
```
#### initiate the UCI protocol
```
mutation u {
  Engine(id: "1") {
  	uci {
      identity {
        name
        author 
      }
      uciok
    }
  }
}
```
#### set [spin|button|check|combo] option
These sound line UI settings, but are really engine options of various types. See the UCI documentation for the various arguments are.
```
mutation o {
  Engine(id: "1") {
  	setSpinOption(name:"Contempt" value: 100) 
  }
}
```

#### Check if the engine is ready for analyzing
```
mutation r {
    Engine(id: "1") {
  	isready {
      response
    } 
  }
}
```

#### go 
The `go` command returns the engine's evaluation of the best move for the current position
```
mutation g {
    Engine(id: "1") {
  	go {
			value
    } 
  }
}
```

#### go infinite
The engine will continue to evaluate the position until stopped.  As it does so, it will emit `info` responses; you must be subscribed to these to receive them. In the GraphQL "playground", a subscription must be started in a separate browser tab (same url):

```
subscription s {
  info
}
```

and, in the other tab:

```
mutation gi {
    Engine(id: "1") {
  	goInfinite 
  }
}
```

To stop the analysis:
```
mutation st {
    Engine(id: "1") {
  	stop {
			value
    } 
  }
}
```

The value returned (eventually, the engine does not stop immediately) will be the best move.

#### quiting the engine
```
mutation q {
  Engine(id: "1") {
    quit
  }
}
```
