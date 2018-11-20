/* eslint-env mocha */
const chai = require('chai');

chai.should();

const EngineQueue = require('../engine/queue').default;

describe('go infinite test', () => {
  const engineQueue = new EngineQueue({ length: 1 });
  let instance;

  before((done) => {
    engineQueue.requestEngine()
      .then((engine) => {
        instance = engine;
        engineQueue.uci(engine.engineId);
      })
      .then(() => done())
      .catch(e => done(e));
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

  it('go and stop', (done) => {
    engineQueue.go(instance.engineId, { infinite: true })
      .then(response => response.should.equal('acknowledged'))
      .then(() => new Promise(resolve => setTimeout(() => { resolve(); }, 1000)))
      .then(() => console.log('wait over'))
      .then(() => engineQueue.stop(instance.engineId))
      .then(response => response.should.equal('acknowledged'))
      .then(() => done())
      .catch((e) => { console.error(e); done(e); });
  }).timeout(5000);
});
