import express from 'express';
import bodyParser from 'body-parser';
import {graphqlExpress, graphiqlExpress} from 'apollo-server-express'
import schema from './schema';

const PORT = 3001;
const app = express();
const graphiql = true;

app.use('/graphql', bodyParser.json(), graphqlExpress(request => ({schema})))
app.get('/graphiql', graphiqlExpress({endpointURL: '/graphql', query: `# Welcome to chessQ
query createEngine {
  createEngine {
    engineId
    state
  }
}

query registerLater {
  registerLater(engineId: "2f47aee8-a19c-4099-b9b8-45bb210eb751")
}

query register {
  register(engineId: "2f47aee8-a19c-4099-b9b8-45bb210eb751" name: "JeffML", code: "mySecretCode")
}

query uci {
  uci(engineId: "2f47aee8-a19c-4099-b9b8-45bb210eb751") {
    identity {name author}
    options { name type}
  }
}
`}));

app.listen(PORT, () => {
  console.log("chessQ server is ready")
});
