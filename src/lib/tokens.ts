import {
  JWT_ACCESS_TOKEN_SECRET,
  JWT_REFRESH_TOKEN_SECRET,
}from './constants.js';

import jwt from 'jsonwebtoken'
interface Tokens {
  accessToken: string,
  refreshToken: string,
}

export function generateToken( id : string): Tokens {
  const accessToken = jwt.sign({sub: id}, JWT_ACCESS_TOKEN_SECRET, {
    expiresIn:'10mins',
  });

  const refreshToken = jwt.sign({ sub:id }, JWT_REFRESH_TOKEN_SECRET,{
    expiresIn:'1d',
  });
  return { accessToken, refreshToken };
}
