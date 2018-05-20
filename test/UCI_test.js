var chai = require('chai');
var should = chai.should();
var EngineQueue = require('../engine/queue').default
var EngineOps = require('../engine/queue').EngineOps

describe("UCI prolog tests", () => {
  var instance;
  const engineQueue = new EngineQueue({length: 1})
  after(done => {
    engineQueue.killAllAndExit()
    done()
  })

  it("invoke UCI", done => {
    engineQueue.requestEngine().then(engine => {
      engineQueue.uci(engine.engineId).then(res => {
        console.log(res)
        done()
      }).catch(e => done(e))
    });
  }).timeout(5000);

});
