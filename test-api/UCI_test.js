/* eslint-env mocha */
import { createApolloFetch } from 'apollo-fetch';
import chai from 'chai';

chai.should();

const uri = 'http://localhost:3001/graphql';
const apolloFetch = createApolloFetch({ uri });

describe('UCI request', function () {
  this.timeout(5000);

  it('create engine instance', (done) => {
    const query = `
      {
        createEngine {engineId}
      }
    `;

    apolloFetch({ query /* variables, operationName */ }) // all apolloFetch arguments are optional
      .then((result) => {
        const { data, errors /* , extensions */ } = result;
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
  });


  it('Switch to UCI', (done) => {
    const query = `
      mutation {
        Engine(id: "1") {
          uci {
            identity {
              name, author
            }
            options {
              name, type
            }
            uciok
          }
        }
      }
    `;

    apolloFetch({ query /* variables, operationName */ }) // all apolloFetch arguments are optional
      .then((result) => {
        const { data, errors /* , extensions */ } = result;
        if (errors) {
          done(new Error(JSON.stringify(errors)));
          return;
        }
        // console.log(data);
        data.should.have.property('Engine');
        const eng = data.Engine;

        eng.should.have.property('uci');
        eng.uci.should.have.property('identity');
        eng.uci.should.have.property('options');
        eng.uci.options.should.be.an('array');
        // eslint-disable-next-line no-unused-expressions
        eng.uci.uciok.should.be.ok;
        done(null, data);
      // GraphQL errors and extensions are optional
      })
      .catch((error) => {
        done(error);
      // respond to a network error
      });
  });
});
