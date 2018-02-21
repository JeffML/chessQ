import express from 'express';
import bodyParser from 'body-parser';
import {graphqlExpress, graphiqlExpress} from 'apollo-server-express';

import {execute, subscribe} from 'graphql'
import {createServer} from 'http';
import {SubscriptionServer} from 'subscriptions-transport-ws';

import schema from './schema';
import defaultQueries from './defaultQueries';

const PORT = 3001;
const app = express();

const ws = createServer(app);

app.use('/graphql', bodyParser.json(), graphqlExpress({schema}))

ws.listen(PORT, () => {
  console.log(`chessQ Server is now running on http://localhost:${PORT}`);
  // Set up the WebSocket for handling GraphQL subscriptions
  new SubscriptionServer({
    execute,
    subscribe,
    schema
  }, {
    server: ws,
    path: '/subscriptions'
  });
});

const opts = {
  endpointURL: '/graphql',
  // query: defaultQueries,
  subscriptionsEndpoint: `ws://localhost:${PORT}/subscriptions`
};
app.get('/graphiql', graphiqlExpress(opts));
