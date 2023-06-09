import { DataSource } from "typeorm";
import { User } from "./entities/User";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "ubuntu",
  password: "password",
  database: "yelp",
  synchronize: true,
  logging: true,
  entities: [User],
  subscribers: [],
  migrations: [],
});
AppDataSource.initialize();
