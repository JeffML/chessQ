import fetch from '../fetch';

async function uci() {
  const query = `
  mutation {
    Engine(id: "1") {
      uci {
        identity {
          name, author
        }
        options {
          name, type
        }
        uciok
      }
    }
  }
`;

  return fetch(query);
}

export default uci;
