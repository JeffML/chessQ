import fetch from '../fetch';

async function createEngine() {
  const query = `
  {
    createEngine {engineId}
  }
`;

  const data = await fetch(query);
  return data;
}

export default createEngine;
