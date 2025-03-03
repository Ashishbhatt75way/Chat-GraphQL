import { PrismaClient, User, Message } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createUserTokens } from "../common/services/passport-jwt.service";

const prisma = new PrismaClient();

const resolvers = {
  Query: {
    me: async (_: unknown, __: unknown, context: any) => {
      try {
        if (!context.userId) {
          throw new Error("User not authenticated");
        }

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
      return await prisma.user.findMany();
    },
    messages: async () => {
      return await prisma.message.findMany();
    },
    getMessages: async (
      _: unknown,
      { receiverId }: { receiverId: string },
      context: any
    ) => {
      if (!context.userId) {
        throw new Error("User not authenticated");
      }

      return await prisma.message.findMany({
        where: {
          OR: [
            { senderId: context.userId, receiverId },
            { senderId: receiverId, receiverId: context.userId },
          ],
        },
        orderBy: { createdAt: "asc" },
      });
    },
  },
  Mutation: {
    createUser: async (_: any, { email, password, name }: User) => {
      const userExist = await prisma.user.findUnique({ where: { email } });

      if (userExist) {
        throw new Error("User already exists");
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      return await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          active: true,
        },
      });
    },
    login: async (_: any, { email, password }: User) => {
      const user = await prisma.user.findUnique({ where: { email } });

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

      return createUserTokens(user);
    },
    createMessage: async (
      _: any,
      { content, receiverId }: { content: string; receiverId: string },
      context: any
    ) => {
      if (!context.userId) {
        throw new Error("User not authenticated");
      }

      return await prisma.message.create({
        data: {
          content,
          senderId: context.userId,
          receiverId,
        },
      });
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
  Message: {
    sender: async (message: Message) => {
      return await prisma.user.findUnique({ where: { id: message.senderId } });
    },
    receiver: async (message: Message) => {
      return await prisma.user.findUnique({
        where: { id: message.receiverId },
      });
    },
  },
};

export default resolvers;
