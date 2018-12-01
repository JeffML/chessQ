/* eslint-env mocha */
/* eslint-disable import/no-extraneous-dependencies */
// import { createApolloFetch } from 'apollo-fetch';
import fetch from 'node-fetch';

import { execute, makePromise } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import gql from 'graphql-tag';


const uri = 'http://localhost:3001/graphql';
// const apolloFetch = createApolloFetch({ uri });
const link = new HttpLink({ uri, fetch });

const doQuery = (query) => {
  const operation = {
    query: gql`${query}`,
  };

  return makePromise(execute(link, operation));
};

// const fetch = query => new Promise((resolve, reject) => {
//   apolloFetch({ query /* variables, operationName */ }) // all apolloFetch arguments are optional
//     .then((result) => {
//       const { data, errors /* , extensions */ } = result;
//       if (errors) {
//         console.error(errors);
//         reject(new Error(errors));
//       } else {
//         resolve(data);
//       }
//     });
// });

export default doQuery;
