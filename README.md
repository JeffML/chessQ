# chessQ
Chess quality analyzer, using UCI, RabbitMQ, and GraphQL

## Where are we?
Need to write resolver using https://github.com/nmrugg/stockfish.js;
Later, write resolvers using node-uci. Determine which root resolver to use by 'embedded' || 'node_uci' sysvar(?) with exe path


# Notes
* 'option name Hash type spin default 16 min 1 max 2048'
  * lies; 64 seems to be the max


#graphql interface

## states
* preamble
  * 'uci'  -> config
  * 'register' -> for commercial engine
* config
  * setoption[]  -> config
  * isready -> ready
* ready
  * ucinewgame -> config
  * position -> searching
* searching
  * go
  * stop
  * ponderhit
  * **SUBSTATES**
    * go infinite
    * UCI_AnalyseMode
    * go ponder



## stateless commands
* 'debug'
* 'isready' acts like a ping
* quit
