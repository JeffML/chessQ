/* eslint-env mocha */
const chai = require('chai');

chai.should();

const EngineQueue = require('../engine/queue').default;

describe('go test', () => {
  const engineQueue = new EngineQueue({ length: 1 });
  let instance;

  before((done) => {
    engineQueue.requestEngine().then((engine) => {
      instance = engine;
      engineQueue.uci(engine.engineId).then(() => done());
    });
  });

  after((done) => {
    engineQueue.killAllAndExit();
    done();
  });

  it('is ready', (done) => {
    engineQueue.isReady(instance.engineId)
      .then(done())
      .catch(e => done(e));
  });

  it('go not infinite', (done) => {
    engineQueue.go(instance.engineId, { infinite: false })
      .then((response) => {
        // console.log({ response });
        response.should.have.property('value');
        response.should.have.property('ponder');
        done();
      }).catch(e => done(e));
  }).timeout(5000);

  it('go and stop', (done) => {
    // this.skip();
    engineQueue.go(instance.engineId, { infinite: true })
      .then((response) => { console.log('go infinite'); return response; })
      .then(response => response.should.equal('acknowledged'))
      .then(() => new Promise(resolve => setTimeout(() => { resolve(); }, 3000)))
      .then(() => console.log('wait over'))
      .then(() => engineQueue.stop(instance.engineId))
      .then(response => response.should.equal('acknowledged'))
      .then(() => done());
  }).timeout(15000);
});
