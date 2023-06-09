import { Request, Response } from "express";
import { Redis } from "ioredis";
import session from "express-session";

export type MyContext = {
  req: Request & { session: session.Session & { userId?: number } };
  redis: Redis;
  res: Response;
};
