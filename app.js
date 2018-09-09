import express from 'express';

import { ApolloServer } from 'apollo-server-express';

// import {
//   execute,
//   subscribe,
// } from 'graphql';

import {
  createServer,
} from 'http';

// import {
//   SubscriptionServer,
// } from 'subscriptions-transport-ws';

import { typeDefs } from './schema';
import resolvers from './resolvers';

const PORT = 3001;
const app = express();

// const ws = createServer(app);

// ws.listen(PORT, () => {
//   console.log(`The chessQ Server is now running on http://localhost:${PORT}`);
//   // Set up the WebSocket for handling GraphQL subscriptions
//   // eslint-disable-next-line no-new
//   new SubscriptionServer({
//     execute,
//     subscribe,
//     schema,
//   }, {
//     server: ws,
//     path: '/subscriptions',
//   });
// });

// const opts = {
//   endpointURL: '/graphql',
//   // query: defaultQueries,
//   subscriptionsEndpoint: `ws://localhost:${PORT}/subscriptions`,
// };
// app.get('/graphiql', graphiqlExpress(opts));

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req, connection }) => {
    // @see https://www.apollographql.com/docs/apollo-server/v2/features/subscriptions.html#Context-with-Subscriptions
    if (connection) {
      // check connection for metadata
      return {};
    }
    // check from req
    const token = req.headers.authorization || '';

    return { token };
  },
});

server.applyMiddleware({
  app,
  gui: {
    endpointURL: '/graphql',
    subscriptionsEndpoint: `ws://localhost:${PORT}/subscriptions`,
  },
});

app.listen({ port: PORT }, () => console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`));
