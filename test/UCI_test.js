var chai = require('chai');
var should = chai.should();
var EngineQueue = require('../engine/queue').default
var EngineOps = require('../engine/queue').EngineOps

describe("UCI prolog tests", () => {
    var instance;
    const engineQueue = new EngineQueue({ length: 1 })
    var instance;

    after(done => {
        engineQueue.killAllAndExit()
        done()
    })

    it("invoke UCI", done => {
        engineQueue.requestEngine().then(engine => {
            instance = engine;
            engineQueue.uci(engine.engineId).then(res => {
                res.should.have.property("identity")
                res.identity.should.have.property("name")
                res.identity.should.have.property("author")
                res.should.have.property("options")
                res.options.should.have.lengthOf.above(1)
                done()
            }).catch(e => done(e))
        });
    }).timeout(5000);

    it("invoke isReady", done => {
        engineQueue.isReady(instance.engineId).then(res => {
            res.should.have.property("errors")
            res.errors.should.have.lengthOf(0)
            res.should.have.property("response")
            res.response.should.equal("readyok")
            done();
        }).catch(e => done(e))
    })

    it("invoke ucinewgame", done => {
        engineQueue.newGame(instance.engineId, "startpos").then(res => {
            res.should.equal("acknowledged")
            done();
        }).catch(e => done(e))
    })

});