const express =require('express');
const expressGraphQL =require('express-graphql');
const schema = require('./schema');
const db = require('./server-db');

const app = express();

app.use('/graphql', expressGraphQL({
  schema,
  graphiql: true,
}));

app.listen(3000, () => {
  console.log('🤖  Express server listening @ http://localhost:3000');
});
