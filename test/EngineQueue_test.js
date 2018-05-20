var chai = require('chai');
var should = chai.should();
var EngineQueue = require('../engine/queue').default

describe("Engine Queue tests", () => {
  var instance;
  const engineQueue = new EngineQueue({length: 1})

  after(done => {
    engineQueue.killAllAndExit()
    done()
  })

  it("Create Engine instance", done => {
    engineQueue.requestEngine().then(engine => {
      instance = engine
      engine.should.have.property("engineId")
      engine.should.have.property("state")
      engine.engineId.should.not.have.lengthOf(0);
      engine.state.should.equal("CREATED")
      done();
    }).catch(e => {
      done(e)
    })
  }).timeout(4000)
})
