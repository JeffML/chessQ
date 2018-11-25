/* eslint-env mocha */
import { createApolloFetch } from 'apollo-fetch';

const uri = 'http://localhost:3001/graphql';
const apolloFetch = createApolloFetch({ uri });

const fetch = query => new Promise((resolve, reject) => {
  apolloFetch({ query /* variables, operationName */ }) // all apolloFetch arguments are optional
    .then((result) => {
      const { data, errors /* , extensions */ } = result;
      if (errors) {
        console.error(errors);
        reject(new Error(errors));
      } else {
        resolve(data);
      }
    });
});

export default fetch;
