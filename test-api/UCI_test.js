/* eslint-env mocha */
import { createApolloFetch } from 'apollo-fetch';
import chai from 'chai';

chai.should();

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

describe('UCI request', function () {
  this.timeout(5000);

  it('create engine instance', (done) => {
    const query = `
      {
        createEngine {engineId}
      }
    `;

    fetch(query)
      .then((data) => {
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

    fetch(query)
      .then((data) => {
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
      })
      .catch((error) => {
        done(error);
      });
  });

  it('invoke isReady', (done) => {
    const query = `
      mutation {
          Engine(id: "1") {
            isready {
              errors
              info
              response
            }
          }
      }`;

    fetch(query)
      .then((res) => {
        const eng = res.Engine;
        eng.should.have.property('isready');
        eng.isready.should.have.property('errors');
        eng.isready.errors.should.have.lengthOf(0);
        eng.isready.should.have.property('response');
        eng.isready.response.should.equal('readyok');
        done();
      }).catch(e => done(e));
  });

  it('invoke ucinewgame', (done) => {
    const query = ` mutation {
      Engine(id: "1") {
        newGame(positionType: startpos)
      }
    }`;
    fetch(query)
      .then((res) => {
        const eng = res.Engine;
        eng.should.have.property('newGame');
        eng.newGame.should.equal('acknowledged');
        done();
      }).catch(e => done(e));
  });
});
