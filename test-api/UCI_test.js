/* eslint-env mocha */
import { createApolloFetch } from 'apollo-fetch';
import chai from 'chai';

chai.should();

const uri = 'http://localhost:3001/graphql';
const apolloFetch = createApolloFetch({ uri });

describe('UCI request', () => {
  it('invoke UCI', (done) => {
    const query = `
      {
        createEngine {engineId}
      }
    `;

    apolloFetch({ query /* variables, operationName */ }) // all apolloFetch arguments are optional
      .then((result) => {
        const { data, errors, extensions } = result;
        if (errors) {
          done(errors);
          return;
        }
        // console.log(data);
        data.should.have.property('createEngine');
        data.createEngine.should.have.property('engineId');
        data.createEngine.engineId.should.equal('1');
        done(null, data);
      // GraphQL errors and extensions are optional
      })
      .catch((error) => {
        done(error);
      // respond to a network error
      });
  }).timeout(5000);
});
