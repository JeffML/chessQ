import express from 'express';
import bodyParser from 'body-parser';
import {graphqlExpress, graphiqlExpress} from 'apollo-server-express'
import schema from './schema';

const PORT = 3001;
const app = express();
const graphiql = true;

app.use('/graphql', bodyParser.json(), graphqlExpress(request => ({schema})))
app.get('/graphiql', graphiqlExpress({endpointURL: '/graphql', query: `# Welcome to chessQ
query registerLater {
  registerLater(engineId: "Flibbit")
}
`}));

app.listen(PORT, () => {
  console.log("chessQ server is ready")
});
