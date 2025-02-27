import bcrypt from "bcryptjs";
import { type Request } from "express";
import createError from "http-errors";
import jwt from "jsonwebtoken";
import passport from "passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Strategy as LocalStrategy } from "passport-local";
import { User, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const isValidPassword = (value: string, password: string) =>
  bcrypt.compare(value, password);

export const initPassport = (): void => {
  passport.use(
    new Strategy(
      {
        secretOrKey: process.env.JWT_ACCESS_SECRET,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      },
      async (token: { user: Request["user"] }, done) => {
        try {
          if (!token.user) {
            return done(null, false, { message: "Invalid token" });
          }
          return done(null, token.user);
        } catch (error) {
          return done(error, false);
        }
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        try {
          const user = await prisma.user.findFirst({ where: { email } });

          if (!user)
            return done(createError(401, "Invalid email or password"), false);
          if (!user.active)
            return done(createError(401, "User is inactive"), false);

          const validate = await isValidPassword(password, user.password);
          if (!validate)
            return done(createError(401, "Invalid email or password"), false);

          const { password: _p, ...result } = user;
          return done(null, result, { message: "Logged in Successfully" });
        } catch (error: any) {
          return done(createError(500, error.message));
        }
      }
    )
  );
};

export const createUserTokens = (user: Omit<User, "password">) => {
  const accessTokenSecret = process.env.JWT_ACCESS_SECRET ?? "";
  const refreshTokenSecret = process.env.JWT_REFRESH_SECRET ?? "";

  const accessToken = jwt.sign(user, accessTokenSecret, { expiresIn: "1d" });
  const refreshToken = jwt.sign(user, refreshTokenSecret, { expiresIn: "7d" });

  return { accessToken, refreshToken };
};

export const decodeToken = (token: string): User | null => {
  try {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET ?? "") as User;
  } catch (error: any) {
    console.error("Invalid token:", error.message);
    return null;
  }
};
