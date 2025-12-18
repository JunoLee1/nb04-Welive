import type { RequestHandler } from "express";
import { Service } from './auth.services.js'
import type { LoginRequestDTO }from'../DTO/auth.dto.js' 
import { clearTokenCookies, setTokenCookies } from './auth.cookies.js'
import { HttpError } from "../../lib/middleware/error.middleware/httpError.js";
import { generateToken } from "../../lib/tokens.js";
export class Controller {
    constructor(
      private readonly service: Service,
    ) {}

    loginHandler: RequestHandler = async (req, res, next) => {
      const { username, password }: LoginRequestDTO = req.body; 
      const user = req.user;
      if (!user) throw new HttpError(401, "인증되지 않는 유저 입니다.")//TODO:  fix error message
      const data = await this.service.login({ username, password });
      // generate token
      const { accessToken, refreshToken } = generateToken(user.id); 
      setTokenCookies({ res, accessToken, refreshToken })
      res.status(200).send(data);
    }

    logoutHandler: RequestHandler = async (req, res, next) => {
      // logout success ? delete cookie, return 204 status
      clearTokenCookies(res)
      return res.status(204)
    }
    
    refreshTokenHandler: RequestHandler = async (req, res, next) => {
      // TODO: refresh token logic
      // TODO: should I check cookies type ?
      // renew token  sucucess, set token to cookie, return 204 status
      return res.status(204)
    }
}
