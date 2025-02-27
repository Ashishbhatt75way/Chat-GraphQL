import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./app/graphQL/schema";
import resolvers from "./app/graphQL/resolvers";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import { authenticateJwt } from "./app/common/middleware/AuthenticateJwt";
import { initPassport } from "./app/common/services/passport-jwt.service";
import { Request } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

dotenv.config();

const prisma = new PrismaClient();

interface Context {
  prisma: PrismaClient;
  userId?: string;
}

const server = new ApolloServer<Context>({
  typeDefs,
  resolvers,
});

const startServer = async () => {
  initPassport(); // Initialize Passport strategies

  const { url } = await startStandaloneServer(server, {
    listen: { port: 5000 },
    context: async ({ req }) => {
      const token = req.headers.authorization?.replace("Bearer ", "");

      let userId: string | undefined;

      if (token) {
        try {
          const user = jwt.verify(
            token,
            process.env.JWT_ACCESS_SECRET!
          ) as JwtPayload;
          userId = user.id;
        } catch (error) {
          console.error("Authentication error:", error);
        }
      }
      return { prisma, userId };
    },
  });

  console.log(`Server ready at: ${url}`);
};

startServer();
