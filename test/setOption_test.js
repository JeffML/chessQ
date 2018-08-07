/* eslint-env mocha */
const chai = require('chai');

const should = chai.should();
const EngineQueue = require('../engine/queue').default;


describe('Set Option tests', () => {
  const engineQueue = new EngineQueue({ length: 1 });
  let instance;
  const isReady = () => engineQueue.isReady(instance.engineId);

  before((done) => {
    console.log('before');
    engineQueue.requestEngine().then((engine) => {
      instance = engine;
      engineQueue.uci(engine.engineId).then(() => done());
    });
  });

  after((done) => {
    console.log('after');
    engineQueue.killAllAndExit();
    done();
  });

  it('set good option', (done) => {
    engineQueue.setSpinOption(instance.engineId, 'Contempt', 100);
    isReady().then((response) => {
      response.should.have.property('response');
      response.response.should.equal('readyok');
      response.should.have.property('errors');
      response.errors.should.have.lengthOf(0);
      done();
    }).catch(e => done(e));
  });

  it('set bad option', (done) => {
    engineQueue.setSpinOption(instance.engineId, 'GooglyMoogly', 100);
    isReady().then((response) => {
      console.log(response);
      response.should.have.property('response');
      response.response.should.equal('readyok');
      response.should.have.property('errors');
      response.errors.should.have.lengthOf.above(0);
      console.log('expected errors', response.errors);
      done();
    }).catch(e => done(e));
  });

  it('set multiple option types', (done) => {
    engineQueue.setSpinOption(instance.engineId, 'Contempt', 100);
    engineQueue.setButtonOption(instance.engineId, 'Clear Hash');
    engineQueue.setCheckOption(instance.engineId, 'Ponder', true);
    engineQueue.setComboOption(instance.engineId, 'UCI_Variant', 'crazyhouse');
    engineQueue.setSpinOption(instance.engineId, 'Skill Level Maximum Error', 1001);
    isReady().then((response) => {
      response.should.have.property('response');
      response.response.should.equal('readyok');
      response.should.have.property('errors');
      response.errors.should.have.lengthOf(0);
      response.should.have.property('info');
      response.info.should.have.lengthOf(1);
      console.log('expected info', response.info);
      done();
    }).catch(e => done(e));
  });
});
