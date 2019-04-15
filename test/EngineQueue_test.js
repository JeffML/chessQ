/* eslint-env mocha */
import chai from 'chai';
import EngineQueue from '../engine/EnginePool';

chai.should();

describe('Engine Queue tests', () => {
  const engineQueue = new EngineQueue({ length: 3 });

  after((done) => {
    engineQueue.killAllAndExit();
    done();
  });

  it('Create Engine instance', (done) => {
    engineQueue.requestEngine().then((engine) => {
      console.log({ engine });
      engine.should.have.property('engineId');
      engine.should.have.property('state');
      engine.engineId.should.not.have.lengthOf(0);
      engine.state.should.equal('CREATED');
      done();
    }).catch((e) => {
      done(e);
    });
  }).timeout(4000);
});
