## branch:backend_postgresql

The main job of this branch is to create a back-end framework, so that the database can realize basic user creation functions, and use redis for session management to realize user login and logout.

The technologies used are:
- Apollo server
- Express
- redis
- TypeGraphQL
- TypeORM
- PostgreSQL

reference doc : [type-graphql](https://typegraphql.com/)

First, install package

```bash
npm install type-graphql
npm install typeorm reflect-metadata
npm install express-session
npm install argon2
npm install --save-dev @types/uuid
npm install nodemailer
npm install connect-redis redis @types/redis
```

Add a line of import in the first line of `index.ts`

```typescript
import "reflect-metadata";
```

Because when using TypeORM and some other libraries in TypeScript, you need to import the "reflect-metadata" library at the top of the application's main entry file.

modify `tsconfig.json`,

change `experimentalDecorators` into `true`：

```json
"experimentalDecorators": true
```

change `emitDecoratorMetadata` into `true`
```json
"emitDecoratorMetadata": true
```

Create a new folder `entities` in the `src` directory, create a `User.ts` file in the `entities` folder, and define the `User` entity:

```typescript
import { ObjectType, Field } from "type-graphql";
import { Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Column, BaseEntity } from "typeorm";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => String)
  @CreateDateColumn()
  createdAt!: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt!: Date;

  @Field()
  @Column({ unique: true })
  username!: string;

  @Field()
  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;
}
```

This code uses TypeGraphQL and the TypeORM library to define an entity class named `User`. The following are annotations explaining each decorator:

- `@ObjectType()`: Declare the class as a GraphQL ObjectType, indicating that it is a type that can be used in GraphQL.
- `@Entity()`: Map this class to a database entity, which corresponds to a table in the database.
- `@Field()`: Expose properties as fields in GraphQL queries and mutations.
- `@PrimaryGeneratedColumn()`: Maps a property as an auto-generated primary key column.
- `@CreateDateColumn()`: Maps a property to an auto-generated creation date column.
- `@UpdateDateColumn()`: Maps a property to an auto-generated update date column.
- `@Column()`: Map properties to database columns.
- `@Column({ unique: true })`: Map the attribute to a database column and set it to be unique.

Create a new folder `resolvers` in the `src` directory, create a `user.ts` file in the `resolvers` folder, define `UserResolver` and related classes (such as `Error` and `Response`).

Define the database operation function in `user.ts`, and use the decorator:

- The `@Resolver` decorator is a decorator in the TypeGraphQL library that identifies a class as a GraphQL resolver (Resolver). What it does is mark a class with parsing logic as a GraphQL resolver, so that the TypeGraphQL library can recognize it and use it to build GraphQL APIs. When a class is decorated with the @Resolver decorator, it is considered a GraphQL resolver and can contain various methods with @Query, @Mutation, @Subscription, etc. decorators. These decorators define the query, mutation, and subscription operations in the GraphQL API, and their method bodies contain the parsing logic associated with these operations.
- The `@Field(() => [FieldError], { nullable: true }) `decorator is used to mark the errors property as a field of type GraphQL object. `() => [FieldError]` specifies that the type of the field is an array of FieldError objects. { nullable: true } means the field can be null.
- The `@Arg` decorator is a decorator in the TypeGraphQL library that marks the arguments of resolver functions as arguments to GraphQL operations (queries or mutations). The `@Arg` decorator can be used in `two` ways:

1. Type inference for parser function arguments:
The `@Arg` decorator can infer the type of the parameter when the parser function parameter does not specify the type explicitly.
From the type annotation or default value of the parameter to which the decorator is applied, TypeGraphQL can determine the GraphQL type of the parameter.
For example, @Arg("name") name: string will infer the GraphQL type of the parameter name as String.
2. Mark resolver function arguments as arguments to GraphQL operations:
The `@Arg` decorator marks an argument to a resolver function as an argument to a GraphQL operation (query or mutation).
According to the parameter of the decorator, information such as the name and type of the parameter in the GraphQL operation can be specified.
For example, `@Arg("name", () => String)` marks a parameter as a parameter of a GraphQL operation with name name and type String.

- The `@Ctx` decorator is to mark the parameters in the resolver function as a GraphQL context object and provide access to properties and methods in the context object. In this way, the data in the context object can be used in the parser function to complete related operations and logic processing.

- The `@Query` decorator is a decorator in the TypeGraphQL library used to mark methods in resolver classes as GraphQL query fields. In GraphQL, a query is an operation used to fetch data. The `@Query` decorator is used to mark a method in a resolver class as a field callable via a GraphQL query statement. In this way, these methods can be exposed to the client through the GraphQL interface, and the client can use the query statement to request and obtain the corresponding data.

- The `@Mutation` decorator is a decorator in the TypeGraphQL library used to mark methods in resolver classes as GraphQL mutation fields. In GraphQL, mutations are operations that modify data. The `@Mutation` decorator is used to mark methods in resolver classes as fields callable via GraphQL mutation statements. In this way, these methods can be exposed to the client through the GraphQL interface, and the client can use mutation statements to request and perform corresponding data modification operations.

Here are some decorator usage examples:

```typescript
@ObjectType()
class FieldError {
  @Field()
  field!: string;

  @Field()
  message!: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Field(() => [FieldError], { nullable: true })
```
The following are descriptions of some newly created files:

- types.ts: Define the context used by global variables.
- server.ts: defines the parameters of the database connection.
- constants.ts: store fixed parameters.

Create a new `.env` file to store environment variables, and ignore the `.env` file in `.gitignore`.

First install the packages required to use the environment variable:

```bash
npm install dotenv
```

In the entry file `index.ts` of the TypeScript code, import and configure dotenv:
```typescript
import dotenv from "dotenv";
dotenv.config();
```