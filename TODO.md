Breakdown:
1. ~~EngineQueue: rename to  EnginePool~~
2. ~~EngineBuilder rename EngineBuilder, returning Engine (can be a mock)~~
3. Have Engine encapsulate(?) a worker thread running Stockfish (internally or as yet another process)

## Where it's at
Subscriptions are now working, both in test and via Playground. I switched to apollo-link-ws for the tests, though I am uncertain as to whether that was the real solution (I discovered that VSCode is hiding part of my terminal output).

response to 'stop' is slow, so I think it is time for some refactoring:
1) use [worker threads](https://nodejs.org/api/worker_threads.html) for engine(s). Node 10.5.4 needed; experimental
2) kill workers after 1 minute of inactivity
3) create a mock UCI Engine wrapper (run in worker thread)
4) test API against that (incl. subscriptions)
5) include worker kill switch in API

## where it needs to go
1) need to ensure API request/response are robust as can be
  -- issues:  sendAndAwait; Errors; engine state management
