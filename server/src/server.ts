import { DataSource } from "typeorm";
import { Post } from "./entities/Post";
import { User } from "./entities/User";
import { Updoot } from "./entities/Updoot";
import dotenv from "dotenv";
dotenv.config();

const host = process.env.NODE_ENV === "production" ? "psql-container" : "localhost";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: host,
  port: process.env.DATABASE_PORT as number|undefined,
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  synchronize: true,
  logging: true,
  entities: [Post, User, Updoot],
  subscribers: [],
  migrations: [],
});
AppDataSource.initialize();
