/* eslint-env mocha */
/* eslint-disable import/no-extraneous-dependencies */
// see https://www.apollographql.com/docs/link/index.html#standalone
import fetch from 'node-fetch';

import { execute, makePromise } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import gql from 'graphql-tag';


const uri = 'http://localhost:3001/graphql';
const link = new HttpLink({ uri, fetch });

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

  return execute(link, operation).subscribe(handlers);
};
export default doQuery;
export { subscribe };
