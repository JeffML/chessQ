# chessQ, v0.1.0

![build status](https://travis-ci.org/JeffML/chessQ.svg?branch=master)

GraphQL wrapper around Universal Chess Interface

## details on subscription error
### this line is logged when topic is hit (before publish in workerbuilder):
    subscription =>|  1545013826887 | info depth 1 seldepth 1 multipv 1 baseTurn w score cp 90 nodes 20 nps 444 time 45 pv e2e4 pvSan e4 bmc 5
### this line is returned on subscribe (in go-infinite-test subscribe handler)
    received data: 1545013826838, {..

Note that the response is received before it is sent(!): 826838 < 826887


## Where it's at
subscription is not working.  response to 'stop' is slow, so I think it is time for some refactoring:
1) use [worker threads](https://nodejs.org/api/worker_threads.html) for engine(s). Node 11.4 needed; experimental
2) kill workers after 1 minute of inactivity
3) create a mock UCI Engine wrapper (run in worker thread)
4) test API against that (incl. subscriptions)
5) include worker kill switch in API

## where it needs to go
1) need to ensure API request/response are robust as can be

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

# version 0.2.0
    TODO: write resolvers using node-uci. Determine which root resolver to use by 'embedded' || 'node_uci' sysvar(?) with exe path
    add github stats: code coverage, etc.
