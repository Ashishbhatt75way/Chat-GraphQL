import jwt from "jsonwebtoken";
import { Request } from "express";

export const authenticateJwt = async (req: Request) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    throw new Error("No token provided");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };
    return decoded;
  } catch (error) {
    console.error("JWT verification failed:", error);
    throw new Error("Invalid token");
  }
};
