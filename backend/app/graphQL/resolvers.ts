import { Message, PrismaClient, User } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createUserTokens } from "../common/services/passport-jwt.service";

const prisma = new PrismaClient();

const resolvers = {
  Query: {
    me: async (_: unknown, __: unknown, context: any) => {
      try {
        console.log(context.userId);

        const user = await prisma.user.findUnique({
          where: { id: context.userId },
        });

        if (!user) {
          throw new Error("User not found.");
        }

        return user;
      } catch (error) {
        console.error("Error fetching user:", error);
        throw new Error("Internal server error.");
      }
    },
    users: async () => {
      const usersRes = await prisma.user.findMany();
      return usersRes;
    },
    messages: async () => {
      const messages = await prisma.message.findMany();
      return messages;
    },
  },
  Mutation: {
    createUser: async (_: any, { email, password, name }: User) => {
      const userExist = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (userExist) {
        throw new Error("User already exists");
      }

      const salt = await bcrypt.genSalt(10);
      password = await bcrypt.hash(password, salt);

      const userRes = await prisma.user.create({
        data: {
          email,
          password,
          name,
          active: true,
        },
      });

      return userRes;
    },
    login: async (_: any, { email, password }: User) => {
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      console.log(user);
      if (!user) {
        throw new Error("User does not exist");
      }

      if (!user.active) {
        throw new Error("User is not active");
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        throw new Error("Invalid credentials");
      }

      const tokens = createUserTokens(user);
      console.log(tokens);

      return tokens;
    },
    createMessage: async (
      _: any,
      args: { content: string; receiver: string; sender: string },
      context: any
    ) => {
      const { content, sender, receiver } = args;

      console.log("Received args:", args); // Debugging: Log the received arguments

      const message = await prisma.message.create({
        data: {
          content,
          sender,
          receiver,
        },
      });

      return message;
    },

    refreshToken: async (
      _: any,
      { refreshToken }: { refreshToken: string }
    ) => {
      try {
        const decoded = jwt.verify(
          refreshToken,
          process.env.JWT_REFRESH_SECRET!
        ) as { userId: string };

        const accessToken = jwt.sign(
          { userId: decoded.userId },
          process.env.JWT_ACCESS_SECRET!,
          {
            expiresIn: "15m",
          }
        );

        return { accessToken, refreshToken };
      } catch (error) {
        throw new Error("Invalid refresh token");
      }
    },
  },
};

export default resolvers;
