/* eslint-env mocha */
import chai from 'chai';
import createEngine from './tasks/createEngine';
import isReady from './tasks/isReady';
import uci from './tasks/uci';

chai.should();

describe('go and subscribe', function () {
  this.timeout(5000);

  it('preliminaries', async () => {
    await createEngine();
    await uci();
    await isReady();
  });

  // it('go and stop', async () => {
  //   const response = await engineQueue.go(instance.engineId, { infinite: true });
  //   response.should.equal('acknowledged');
  //   return new Promise(resolve => setTimeout(() => { resolve(); }, 1000))
  //     .then(() => engineQueue.stop(instance.engineId))
  //     .then((res) => {
  //       res.should.have.property('value');
  //       res.should.have.property('ponder');
  //     });
  // }).timeout(5000);
});
