import express from "express";
import { ApolloServer,gql } from "apollo-server-express";
import { Pool } from 'pg';

// connect PostgreSQL DB
const pool = new Pool({
  user: 'ubuntu',
  host: 'localhost',
  database: 'yelp',
  password: 'password',
  port: 5432
});

// GraphQL
const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
  }

  type Query {
    getUsers: [User!]!
    getUser(id: ID!): User
  }

  type Mutation {
    createUser(name: String!, email: String!): User
  }
`;

// GraphQL resolvers
const resolvers = {
  Query: {
    getUsers: async () => {
      const { rows } = await pool.query('SELECT * FROM users');
      return rows;
    },
    getUser: async (_:any, { id }:any) => {
      const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
      return rows[0];
    },
  },
  Mutation: {
    createUser: async (_:any, { name, email }:any) => {
      const { rows } = await pool.query(
        'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
        [name, email]
      );
      return rows[0];
    },
  },
};

// Initialize the Express application
const app = express();
app.set("trust proxy", 1);

// set redis


// Set up session middleware


// Initialize Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => ({
    req,
    res,
  }),
});

// Start Apollo Server and apply it to the Express application
async function startServer() {
  await server.start();
  server.applyMiddleware({
    app,
    cors: {
      origin: ["http://localhost:5173","https://studio.apollographql.com"],
      credentials: true,
    },
  });
}

// start the server
startServer().then(() => {
  app.listen({ port: 4000 }, () =>
    console.log(`Server ready at http://localhost:4000${server.graphqlPath}`)
  );
});