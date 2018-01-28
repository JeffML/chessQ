# chessQ
Chess quality analyzer, using UCI, RabbitMQ, and GraphQL


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
