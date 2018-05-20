var chai = require('chai');
var should = chai.should();
var EngineQueue = require('../engine/queue').default

describe("UCI startup", () => {
  var instance;
  const engineQueue = new EngineQueue({length: 1})

  it("Create Engine instance", done => {
    engineQueue.requestEngine().then(engine => {
      instance = engine
      engine.should.have.property("engineId")
      engine.should.have.property("state")
      engine.engineId.should.not.have.lengthOf(0);
      engine.state.should.equal("CREATED")
      engineQueue.killAllAndExit()
      done();
    }).catch(e => {
      engineQueue.killAllAndExit()
      done(e)
    })
  }).timeout(4000)
})
