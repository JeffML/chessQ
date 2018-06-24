# chessQ

![build status](https://travis-ci.org/JeffML/chessQ.svg?branch=master)

GraphQL wrapper around Universal Chess Interface

## Where it's at

-   writing tests

## TODO

-   ✓ isready state
    -   ✓ set when readyok received
    -   ✓ unset on any setoption
        -   only allow set option when not in 'running' state (i.e. go before stop  is called)
-   ucinewgame
-   position
    -   with validation
-   go
-   stop
-   throw workers in proper Node.js worker processes (like from threads.js)

## node-uci

TODO: write resolvers using node-uci. Determine which root resolver to use by 'embedded' || 'node_uci' sysvar(?) with exe path
