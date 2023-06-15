import { DataSource } from "typeorm";
import { Post } from "./entities/Post";
import { User } from "./entities/User";
import { Updoot } from "./entities/Updoot";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "ubuntu",
  password: "password",
  database: "yelp",
  synchronize: true,
  logging: true,
  entities: [Post, User, Updoot],
  subscribers: [],
  migrations: [],
});
AppDataSource.initialize();
