# chessQ
Chess quality analyzer, using UCI, graphql-subscriptions, and GraphQL

## Where are we?
Need to write resolver using https://github.com/nmrugg/stockfish.js;
  -- "You must set onmessage" -- see https://github.com/nmrugg/stockfish.js/blob/master/example/simple_node.js

Later, write resolvers using node-uci. Determine which root resolver to use by 'embedded' || 'node_uci' sysvar(?) with exe path


# Notes
* 'option name Hash type spin default 16 min 1 max 2048'
  * lies; 64 seems to be the max
* go
  * graphiql doesn't seem happy being both an event emitter and receiver
    * once sub is defined (not even run), you can't define (let alone execute) any other query or mutations
    * but... you can open another graphiql browser window and execute mutations. so, okay.
