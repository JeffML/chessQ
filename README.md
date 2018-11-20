# chessQ, v0.1.0

![build status](https://travis-ci.org/JeffML/chessQ.svg?branch=master)

GraphQL wrapper around Universal Chess Interface

## Where it's at
- current bug: 
    - split out go infinite test; issues:
        - if 'is ready' uncommented:
            -- 'isready responded' occurs *after* the subscription lines
            -- no bestmove subscription line received
        - if 'is ready' commented out:
            -- get a best move subscription line
            -- but after test ends
- working on subscription 

## TESTS

### To run a single test:
    npm run testSingle -- test/fooTest

### Unit tests
-   ✓ isready state
    -   ✓ set when readyok received
    -   ✓ unset on any setoption
        -   only allow set option when not in 'running' state (i.e. go before stop  is called)
-   ✓ ucinewgame
-   ✓ position
    -   ✓ with validation
-   ✓ go
-   ✓ stop

### API tests
    - all the above unit tests via GraphQL, plus:
        -  subscriptions


# TODO
Refactor
    -   throw workers in proper Node.js worker processes (like from threads.js)

# version 0.2.0
    TODO: write resolvers using node-uci. Determine which root resolver to use by 'embedded' || 'node_uci' sysvar(?) with exe path
    add github stats: code coverage, etc.
