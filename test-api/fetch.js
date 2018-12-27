/* eslint-env mocha */
/* eslint-disable import/no-extraneous-dependencies */
// see https://www.apollographql.com/docs/link/index.html#standalone
import fetch from 'node-fetch';

import { execute, makePromise } from 'apollo-link';
import { WebSocketLink } from 'apollo-link-ws';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import ws from 'ws';
import { HttpLink } from 'apollo-link-http';
import gql from 'graphql-tag';


const uri = 'http://localhost:3001/graphql';
const wsUri = 'ws://localhost:3001/graphql';

const link = new HttpLink({ uri, fetch });
const wsClient = new SubscriptionClient(wsUri, { reconnect: true }, ws);
const wsLink = new WebSocketLink(wsClient);

const doQuery = (query) => {
  const operation = {
    query: gql`${query}`,
  };

  return makePromise(execute(link, operation));
};

const subscribe = (query, handlers) => {
  const operation = {
    query: gql`${query}`,
  };

  return execute(wsLink, operation).subscribe(handlers);

  // return execute(link, operation).subscribe(handlers);
};
export default doQuery;
export { subscribe };
