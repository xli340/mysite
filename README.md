## branch:backend_post_updoot

The main work of this part is to realize the related functions of post and updoot in the backend including:
- Post creation, modification, deletion
- Additions and modifications to updoot

The technologies used are:
- dataloader
- typeorm

First, install package

```bash
npm install dataloader
```

Dataloader is a utility library for bulk loading data, typically used to handle the data access layer. Its main function is to minimize repeated loading of data and improve the efficiency of data access.
Dataloader works as follows:
1. Receives as input a batch of unique keys.
2. Group the keys and load them in batches.
3. During the loading process, Dataloader will merge duplicate keys to avoid duplicate requests.
4. After the loading is complete, Dataloader will return a data array corresponding to the input keys, maintaining the order of the input keys.
The benefits of using Dataloader include:
1. Batch loading: Dataloader can process multiple requests in batches, reducing multiple requests to data sources and improving efficiency.
2. Data merging: Dataloader merges duplicate keys during the loading process to ensure that each key only triggers data loading once, avoiding duplication of work.
3. Cache support: Dataloader supports caching loaded data, which can reduce the number of repeated loading of the same data.
4. Prefetching data: Dataloader supports prefetching data, which can load data that may be needed in the future in advance to improve response speed

What is the N+1 problem
The N+1 problem is one of the common performance problems in relational databases. It refers to the situation where N+1 database queries need to be executed due to the complexity of data association during data query.
Specifically, when we query an entity (usually a parent entity) and other entities associated with it (usually a child entity), if we do not perform proper optimization, we may encounter the N+1 problem. This means that after fetching the data of the parent entity, N additional queries need to be executed to fetch the data of each child entity.
For example, suppose we have an "Article" entity and an "Author" entity, and there is a one-to-many relationship between them, that is, an author can have multiple articles. When we need to obtain all articles and their corresponding author information, if there is no optimization, the N+1 problem may occur. The query process is as follows:
1. Execute the first query to get the data of all articles.
2. For each article, perform N queries (N is the number of articles) to obtain the corresponding author information.
During this process, we performed N+1 database queries, the first query obtained the data of all articles, and the subsequent N queries were to obtain the author information corresponding to each article. This results in additional database query overhead and longer response times.
The solution to the N+1 problem is usually to obtain the required data at one time through data preloading (Eager Loading) or using associated query (Join), instead of executing multiple queries in a loop. This can reduce the number of database queries and improve query performance.

Here use dataloader to avoid N+1 problem

---
Usage of `transaction`, `query` and `getRepository` in typeorm DataSource

- The `transaction` method is used to perform database operations within a transaction. It accepts a callback function as a parameter in which the entityManager object can be used to perform database operations. This method returns a Promise representing the result of the transaction operation.

 - The `query` method is used to execute native SQL queries. You can pass a SQL query string and an optional parameter array to perform a parameterized query with placeholders.

- The `getRepository` method is used to obtain the repository (Repository) associated with the specified entity class. Repositories provide a set of methods for manipulating entities, such as saving, querying, updating, and deleting.
---
- Create a new file under the entities folder:
Post.ts is used to define the data format of Post
Updoot.ts is used to define the data format of Updoot
Update User.ts to increase the format of the relationship between user and post

- Create a new file under the resolvers folder:
post.ts is used to define post related functions

- Create a new file under the utils folder:
createUpdootLoader.ts
createUserLoader.ts

- Modify index.ts
Add PostResolver to buildSchema
Add userLoader and updootLoader in context

- Modify types.ts
Increase userLoader and updootLoader

- Modify server.ts
Add Post and Updoot in entities

- Create a new folder middleware, and create a new file isAuth.ts in the folder
isAuth export a function to return whether you are currently logged in

---

createUserLoader in detail

code:
```typescript
import DataLoader from "dataloader";
import { In } from "typeorm";
import { User } from "../entities/User";

export const createUserLoader = () =>
  new DataLoader<number, User>(async (userIds) => {
    // Use the incoming user ID array as a condition to query the corresponding user from the database
    const users = await User.findBy({
      id: In(userIds as number[]),
    });

    // Create an object that maps user IDs to user objects
    const userIdToUser: Record<number, User> = {};
    users.forEach((u) => {
      userIdToUser[u.id] = u;
    });

    // According to the incoming user ID array, get the corresponding user objects in order, and return the sorted user array
    const sortedUsers = userIds.map((userId) => userIdToUser[userId]);
    return sortedUsers;
  });
  
```
The above code uses the following features of the Dataloader library:
1. Batch loading: Dataloader realizes the function of batch loading user data by receiving an array of user IDs as input. This can reduce multiple query requests to the database and improve efficiency.
2. Data merging: During the loading process, Dataloader will merge duplicate user IDs to avoid repeated requests for the same user data. This reduces duplication of work and improves loading performance.
3. Data caching: Dataloader supports internal caching of loaded data. If the same user ID is requested multiple times in the same request, Dataloader will perform only one database query and return the loaded data from the cache. This reduces redundant queries to the database and improves response speed.
4. Data sorting: According to the incoming user ID array, Dataloader stores the user object in the userIdToUser object, and provides the sorted user array in the order of the incoming ID. This ensures that the returned array of users is in the same order as the array of user IDs passed in.
These features make Dataloader an effective tool for handling batch data loading scenarios, especially for avoiding the N+1 query problem (that is, the problem of initiating multiple queries in a loop) and optimizing data access performance.

---

The role of `@FieldResolver` decorator
The `@FieldResolver` decorator is a commonly used decorator when using the GraphQL framework (such as Apollo Server), and is used to define the field resolution function in the resolver.
In GraphQL, the field resolution function is used to resolve the fields in the request and provide corresponding data. Each field can have an associated field resolution function that is responsible for fetching the data required for that field and returning it to the client.
The role of the `@FieldResolver` decorator is to convert an ordinary method into a field resolution function and associate it with a specific field. It is used to define these field resolution functions in GraphQL resolvers.
As the following code:
```typescript
  @FieldResolver(() => User)
  creator(@Root() post: Post, @Ctx() { userLoader }: MyContext) {
    return userLoader.load(post.creatorId);
  }
```
* The @FieldResolver(() => User) decorator marks the creator method as a field resolution function and specifies that the return type of the field resolution function is User.
* The @Root() decorator indicates that the first parameter post of the field parsing function is the parent object, namely the Post object. It allows us to access the properties of the parent object in the field resolution function.
* The @Ctx() decorator indicates that the second parameter of the field parsing function is the context object MyContext, which contains the userLoader data loader. Context objects are often used to share data and functionality between parsers.
* userLoader.load(post.creatorId) is an asynchronous operation to load user data using the data loader userLoader. According to the creatorId property of the Post object, get the corresponding user data from the database or other data sources, and return a Promise<User>.
By using the @FieldResolver decorator, we can associate the field resolution function with the corresponding field, and obtain the required data during the resolution process to meet the needs of the GraphQL query.

---
The role of the @Root decorator
The @Root decorator is used in GraphQL resolvers to identify the first parameter of a field resolution function. It represents the parent object to which the currently parsed field belongs.
As the following code:
```typescript
  @FieldResolver(() => User)
  creator(@Root() post: Post, @Ctx() { userLoader }: MyContext) {
    return userLoader.load(post.creatorId);
  }
```
If the `@Root` decorator is not added in the given code, then the first parameter post of the creator method will not be identified as the parent object, and the properties of the parent object Post cannot be directly accessed.
In this case, the post parameter is just an ordinary parameter, which means the first parameter of the field parsing function, and has no special meaning. You will not be able to use the post object directly to access properties of the Post object such as post.creatorId.

---
What the `@OneToMany` decorator does
The @OneToMany decorator is one of the decorators provided by the TypeORM library, which is used to establish a one-to-many relationship between entity classes. Its role is to define the relationship between entity classes, indicating that an entity class has associations with multiple target entity classes.
Inside the brackets of the `@OneToMany()` decorator, two parameters should be filled:
1. The type of the target entity class or a function that returns the target entity class: The first parameter is a function or the type returned by a function, which is used to specify the type of the target entity class or a function that returns the target entity class.
2. A function used to specify the associated field: The second parameter is a function used to specify the associated field, which accepts a parameter representing the attribute or column associated with the current entity class in the target entity class.
---
The role of the `@ManyToOne` decorator
The `@ManyToOne` decorator is one of the decorators provided by the TypeORM library, which is used to establish a many-to-one relationship between entity classes. Its role is to define the relationship between entity classes, indicating that one entity class belongs to another target entity class.

---
The role of the `@UseMiddleware` decorator
The `@UseMiddleware` decorator is one of the decorators used in GraphQL parsers. What it does is apply a middleware function to a specific parser or parser class.
Here's what the `@UseMiddleware` decorator does:
Used to apply a middleware function to a specific parser or parser class. Middleware functions can be used to perform additional logic, such as authentication, permission checks, logging, etc., before or after parser execution.
like:
```typescript
  @Mutation(() => Post)
  @UseMiddleware(isAuth)
  async createPost(
    @Arg("input") input: PostInput,
    @Ctx() { req }: MyContext
  ): Promise<Post> {
    return Post.create({
      ...input,
      creatorId: req.session.userId,
    }).save();
  }
```