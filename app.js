import express from 'express';

import { ApolloServer } from 'apollo-server-express';
import { typeDefs } from './schema';
import resolvers from './resolvers';

const PORT = 3001;
const app = express();


const server = new ApolloServer({
  typeDefs,
  resolvers,
  // context: async ({ req, connection }) => {
  //   // @see https://www.apollographql.com/docs/apollo-server/v2/features/subscriptions.html#Context-with-Subscriptions
  //   if (connection) {
  //     // check connection for metadata
  //     return {};
  //   }
  //   // check from req
  //   const token = req.headers.authorization || '';

  //   return { token };
  // },
});

server.applyMiddleware({
  app,
  gui: {
    endpointURL: '/graphql',
    subscriptionsEndpoint: `ws://localhost:${PORT}/subscriptions`,
  },
});

app.listen({ port: PORT }, () => console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`));
