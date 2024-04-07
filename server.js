const express = require('express');
const mongoose = require('mongoose');
const { ApolloServer } = require('apollo-server-express');
require('dotenv').config();
const cors = require('cors');

const PORT = 4000;
const app = express();

app.use(cors()); // allow cross-origin requests

// Mongoose MongoDB setup
const DB_CONN = `mongodb+srv://abbassaid:GeorgeBrown123@cluster0.e8qefyb.mongodb.net/comp3133_assignment1?retryWrites=true&w=majority`;

// Connect to MongoDB
mongoose.connect(DB_CONN, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then( (success) => {
  console.log('Success Mongodb connection')
}).catch( (error) => {
  console.log('Error Mongodb connection: ' + error.message)
});

// Apollo GraphQL Server setup
const {EmployeeTypeDefs, EmployeeResolvers} = require('./gql/EmployeeGQL');
const {UserTypeDefs, UserResolvers} = require('./gql/UserGQL');

//combine all typeDefs and resolvers
const typeDefs = [EmployeeTypeDefs, UserTypeDefs];
const resolvers = [EmployeeResolvers, UserResolvers];

async function startApolloServer(typeDefs, resolvers) {
  const server = new ApolloServer({ 
    typeDefs,
    resolvers,
    graphiql: true
  });

  await server.start();

  server.applyMiddleware({ app, path: '/graphql' });

  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}/graphql`);
  });
}

startApolloServer(typeDefs, resolvers);
