import fetch from '../fetch';

async function isReady() {
  const query = `
  mutation {
      Engine(id: "1") {
        isready {
          errors
          info
          response
        }
      }
  }`;

  return fetch(query);
}

export default isReady;
