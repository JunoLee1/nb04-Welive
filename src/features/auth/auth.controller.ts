import { RequestHandler } from "express";
import { Service } from './auth.services.js'
import { LoginRequestDTO }from'../DTO/auth.dto.js' 

export class Controller {
    constructor(
      private readonly service: Service,
    ) {}

    loginHandler: RequestHandler = async (req, res, next) => {
      const { username, password }: LoginRequestDTO = req.body; 
      const data = this.service.login({ username, password });
      res.status(200).send(data);
    }

    logoutHandler: RequestHandler = async (req, res, next) => {}
    
    refreshTokenHandler: RequestHandler = async (req, res, next) => {}
}
