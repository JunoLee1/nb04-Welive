import type { RequestHandler } from "express";
import { Service } from './auth.services.js'
import type { LoginRequestDTO }from'../DTO/auth.dto.js' 

export class Controller {
    constructor(
      private readonly service: Service,
    ) {}

    loginHandler: RequestHandler = async (req, res, next) => {
      const { username, password }: LoginRequestDTO = req.body; 
      const data = await this.service.login({ username, password });
      return res.status(200).send(data);
    }

    logoutHandler: RequestHandler = async (req, res, next) => {
      // TODO: logout logic
      // logout success ? delete cookie, return 204 status
      this.service.clearTokenCookies(res)
      return res.status(204)
    }
    
    refreshTokenHandler: RequestHandler = async (req, res, next) => {
      // TODO: refresh token logic
      // TODO: should I check cookies type ?
      // renew token  sucucess, set token to cookie, return 204 status
      return res.status(204)
    }
}
