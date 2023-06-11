import "reflect-metadata";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./resolvers/user";
import session from "express-session";
import Redis from "ioredis";
import connectRedis from "connect-redis";
import { COOKIE_NAME } from "./constants";
import dotenv from "dotenv";

dotenv.config();

const main = async () => {
  // Initialize the Express application
  const app = express();
  app.set("trust proxy", 1);

  // set redis
  const RedisStore = connectRedis(session);
  const redis = new Redis();

  // Set up session middleware
  app.use(
    session({
      name: COOKIE_NAME, // cookie name
      store: new RedisStore({
        client: redis,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
        httpOnly: false,
        sameSite: "none",
        secure: true,
      },
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET as string,
      resave: false,
    })
  );

  // Initialize Apollo Server
  const server = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({
      req,
      res,
      redis,
    }),
  });

  // Start Apollo Server and apply it to the Express application
  async function startServer() {
    await server.start();
    server.applyMiddleware({
      app,
      cors: {
        origin: ["http://localhost:5173", "https://studio.apollographql.com"],
        credentials: true,
      },
    });
  }

  // start the server
  startServer().then(() => {
    app.listen({ port: process.env.PORT }, () =>
      console.log(`Server ready http://localhost:4000${server.graphqlPath}`)
    );
  });

};

main().catch((err) => {
  console.error(err);
});
