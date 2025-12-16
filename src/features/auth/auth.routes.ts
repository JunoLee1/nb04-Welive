import type { RequestHandler } from "express";
import { Controller } from "./auth.controller.js";
// 로그인
const controller = new Controller();
const loginHandler: RequestHandler = async( req, res, next )=> {
    return controller.login;
}
// 로그아웃
const logoutHandler: RequestHandler = async( req, res, next )=> {
   return controller.logout;
}

// 토큰 재발급
const refreshTokenHandler : RequestHandler = async( req, res, next )=> {
    return controller.refreshToken;
}

export {
  loginHandler,
  logoutHandler,
  refreshTokenHandler
}