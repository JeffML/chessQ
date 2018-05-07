# chessQ

Chess quality analyzer, using UCI, graphql-subscriptions, and GraphQL

## Where are we?
  Need to deal with setoption:  no response on success, response on failure
  * between uciok (server) and isready (client) command
    * gather error lines, send on isready
  * ok, now test


Need to write resolver using https://github.com/nmrugg/stockfish.js;
  -- "You must set onmessage" -- see https://github.com/nmrugg/stockfish.js/blob/master/example/simple_node.js
  * no way to tie responses to requests in onmessage(), so will need to change
    * 5 types of response/request
      * request, no response _or error response_
        * setoption
          * no response if ok
          * error response if option not recognized:
           ```
              setoption name Moo Cow value 3
              No such option: Moo Cow
           ```        
      * request, one response
      * request, multiple responses with end tag
      * request, multiple responses with end request (go/stop)
    * create response listener for each request
      * request only
      * request/response(s)
      * request/responses/request <-- maybe: go->responses...->bestmove | stop/bestmove
  Query to Mutation as some point.

Later, write resolvers using node-uci. Determine which root resolver to use by 'embedded' || 'node_uci' sysvar(?) with exe path
