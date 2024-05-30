import { Request, Response, NextFunction } from "express";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import passportJwt from "passport-jwt";
import bcrypt from "bcrypt";
import { UserRepository } from "./../repositories/user.repository";
import * as express from "express";
import * as jwt from "jsonwebtoken";
import { User } from "@src/entities";
import { envVariables } from "./../configs";
import { AuthError } from "./../error/auth.error";

const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const userRepository = new UserRepository();
        const user = await userRepository.findVerifiedUserByEmail(email);
        if (!user) {
          return done(null, false, { message: "No user with that username." });
        }

        if (bcrypt.compareSync(password, user.password)) {
          return done(null, user);
        } else {
          return done(null, false, { message: "Wrong password." });
        }
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: envVariables.SECRET_TOKEN,
    },
    async function (jwtToken, done) {
      try {
        const userRepository = new UserRepository();
        const user = await userRepository.findVerifiedUserByEmail(
          jwtToken.username
        );
        if (user) {
          return done(null, user, jwtToken);
        } else {
          return done(null, false);
        }
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

/**
 * Login Required middleware.
 */
export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.isAuthenticated()) {
    return next();
  }

  return false;
};

export function expressAuthentication(
  req: express.Request,
  securityName: string,
  scopes?: string[]
): Promise<User> {
  const token: string = (req.headers["x-access-token"] as string) ?? "";

  return new Promise((resolve, reject) => {
    if (!token) {
      reject(new AuthError("No token provided."));
    }

    jwt.verify(
      token,
      envVariables.SECRET_TOKEN,
      function (err: any, decoded: any) {
        if (err) {
          reject(new AuthError("Invalid token or expired."));
        } else {
          // Check if scopes are defined before iterating
          if (scopes && Array.isArray(scopes)) {
            for (let scope of scopes) {
              if (!decoded.scopes.includes(scope)) {
                reject(
                  new AuthError("JWT does not contain the required scope.")
                );
              }
            }
          }
          try {
            resolve(decoded);
          } catch (e) {
            reject(new AuthError("Invalid token."));
          }
        }
      }
    );
  });
}

passport.serializeUser<any, any>((req, user, done) => {
  done(undefined, user);
});

passport.deserializeUser(async (id, done) => {
  try {
    const userRepository = new UserRepository();
    const user = await userRepository.findById(Number(id));
    if (!user) {
      return done(null, false);
    }

    done(null, user);
  } catch (err) {
    done(err);
  }
});
