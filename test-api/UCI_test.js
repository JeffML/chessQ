/* eslint-env mocha */
import chai from 'chai';
import fetch from './fetch';
import createEngine from './tasks/createEngine';
import uci from './tasks/uci';
import isReady from './tasks/isReady';

chai.should();

describe('UCI request', function () {
  this.timeout(5000);

  it('create engine instance', (done) => {
    createEngine()
      .then(op => op.data)
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
    uci()
      .then(op => op.data)
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
    isReady()
      .then(op => op.data)
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
      .then(op => op.data)
      .then((res) => {
        const eng = res.Engine;
        eng.should.have.property('newGame');
        eng.newGame.should.equal('acknowledged');
        done();
      }).catch(e => done(e));
  });
});
