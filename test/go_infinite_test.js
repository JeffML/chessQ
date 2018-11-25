/* eslint-env mocha */
import { PubSub } from 'apollo-server-express';

const chai = require('chai');

chai.should();
const pubsub = new PubSub();

const EngineQueue = require('../engine/queue').default;

describe('go infinite test', () => {
  const engineQueue = new EngineQueue({ length: 1, pubsub });
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

  it('is ready', async () => {
    await engineQueue.isReady(instance.engineId);
  });

  it('go and stop', async () => {
    const response = await engineQueue.go(instance.engineId, { infinite: true });
    response.should.equal('acknowledged');
    return new Promise(resolve => setTimeout(() => { resolve(); }, 1000))
      .then(() => engineQueue.stop(instance.engineId))
      .then((res) => {
        res.should.have.property('value');
        res.should.have.property('ponder');
      });
  }).timeout(5000);
});
