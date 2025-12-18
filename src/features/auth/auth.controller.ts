import type { RequestHandler } from "express";
import { Service } from "./auth.services.js";
import type { LoginRequestDTO } from "../DTO/auth.dto.js";
import { clearTokenCookies, setTokenCookies } from "./auth.cookies.js";
import { HttpError } from "../../lib/middleware/error.middleware/httpError.js";
import { generateToken } from "../../lib/tokens.js";

type TokenType = {
  accessToken: string;
  refreshToken: string;
};
export class Controller {
  constructor(private readonly service: Service) {}

  loginHandler: RequestHandler = async (req, res, next) => {
    const { username, password }: LoginRequestDTO = req.body;
    const user = req.user;
    if (!user) throw new HttpError(401, "권한과 관련된 오류입니다."); //TODO:  fix error message
    const data = await this.service.login({ username, password });
    // generate token
    const { accessToken, refreshToken } = generateToken(user.id);
    setTokenCookies({ res, accessToken, refreshToken });
    res.status(200).send(data);
  };

  logoutHandler: RequestHandler = async (req, res, next) => {
    // logout success ? delete cookie, return 204 status
    clearTokenCookies(res);
    return res.status(204);
  };

  refreshTokenHandler: RequestHandler = async (req, res, next) => {
    // renew token  sucucess, set token to cookie, return 204 status 
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new HttpError(401, "refresh token not provided");
    }
    const user = req.user;
    if (!user) throw new HttpError(401, "권한과 관련된 오류입니다."); //TODO:  fix error message
    const { accessToken, refreshToken: newRefreshToken }: TokenType =
      generateToken(user.id);
    setTokenCookies({ res, accessToken, refreshToken: newRefreshToken });
    return res.status(204);
  };
}
