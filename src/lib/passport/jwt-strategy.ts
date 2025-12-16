import type { StrategyOptions, VerifiedCallback } from 'passport-jwt';
import { ExtractJwt,Strategy as JwtStrategy } from 'passport-jwt';
import {
  ACCESS_TOKEN_COOKIE_NAME,
  JWT_ACCESS_TOKEN_SECRET,
  JWT_REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_COOKIE_NAME,
} from '../constants.js';
import prisma from '../prisma.js';

interface JwtPayload {
  sub: string,
  iat?: number,
  exp?: number
}

const accessTokenOptions: StrategyOptions = {
  jwtFromRequest: (req) => req.cookies[ACCESS_TOKEN_COOKIE_NAME],
  secretOrKey: JWT_ACCESS_TOKEN_SECRET,
}
const refreshTokenOptions: StrategyOptions = {
  jwtFromRequest: (req) => req.cookies[REFRESH_TOKEN_COOKIE_NAME],
  secretOrKey: JWT_REFRESH_TOKEN_SECRET,
};

async function jwtVerify( payload:JwtPayload, done: VerifiedCallback ) {
  const user = await prisma.user.findUnique({
    where: { id : payload.sub }
  })
  user ? done(null, user) : done(Error, false); 
};

export const accessTokenStrategy = new JwtStrategy(
  accessTokenOptions,
  jwtVerify
);

export const refreshTokenStrategy = new JwtStrategy(
  refreshTokenOptions,
  jwtVerify
);

