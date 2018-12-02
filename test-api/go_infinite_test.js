/* eslint-env mocha */
import chai from 'chai';
import fetch, { subscribe } from './fetch';
import createEngine from './tasks/createEngine';
import isReady from './tasks/isReady';
import uci from './tasks/uci';


chai.should();

describe('go, subscribe, stop', function () {
  this.timeout(5000);

  it('preliminaries', async () => {
    await createEngine();
    await uci();
    await isReady();
  });


  it('subscribe', async () => {
    const query = `subscription {
      info {
        __typename
      }
    }`;
    // const res = await fetch(query).data;
    const handlers = {
      next: data => console.log(`received data: ${JSON.stringify(data, null, 2)}`),
      error: error => console.log(`received error ${error}`),
      complete: () => console.log('complete'),
    };
    subscribe(query, handlers);
  });

  it('go infinite', async () => {
    const query = `mutation {
      Engine(id: "1") {
        goInfinite 
      }
    }`;

    const res = (await fetch(query)).data;
    res.should.have.property('Engine');
    res.Engine.should.have.property('goInfinite');
    res.Engine.goInfinite.should.equal('acknowledged');
  });


  it('stop', async () => {
    const query = `mutation stop {
      Engine(id: "1") {
        stop {
          value
        }
      }
    }`;
    const { Engine: { stop } } = (await fetch(query)).data;
    stop.should.have.property('value');
    stop.value.should.have.length(4);
  });
});
