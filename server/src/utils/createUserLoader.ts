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
  