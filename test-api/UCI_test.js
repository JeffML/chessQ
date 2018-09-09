import { createApolloFetch } from 'apollo-fetch';

const uri = 'http://localhost:3000/graphql';
const apolloFetch = createApolloFetch({ uri });

describe('UCI request', ((done) => {
  const query = `
  
  `;

  apolloFetch({ query, variables, operationName }) // all apolloFetch arguments are optional
    .then((result) => {
      const { data, errors, extensions } = result;
    // GraphQL errors and extensions are optional
    })
    .catch((error) => {
    // respond to a network error
    });
}));
