# further functionality and improvements

## other engine support
For development of this package, the [embedded stockfish engine](https://www.npmjs.com/package/stockfish) was useful.  For a full implementation, it would be necessary to talk to non-embedded engines running as separate processes; [there is an npm package for this](https://www.npmjs.com/package/node-uci).

### Worker Threads
Ideally, the launching, communication, and stopping of chess engines would be done using [Node.js Worker Threads](https://hackernoon.com/simple-bidirectional-messaging-in-node-js-worker-threads-7fe41de22e3c) (fully supported in version 11.x, and experimentally supported in 10.x). This shouldn't be too hard to do.

## parsing
The parsing of engine responses is pretty rudimentary. 

## error handling
The application tracks engine state based on commands so far issued.  This isn't 100% reliable, but probably the best that can be done.  The biggest problems are (1) unexpected errors, and (2) unexpected responses from the engine.  This may require the engine to be shutdown on an error message with debugging info sent back to the client application.

## documentation
The code isn't very well documented, but does follow a basic template for simple GraphQL server applications. Tests are complete enough to provide working knowledge as to use.