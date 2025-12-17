import { RequestHandler } from "express";
import { Service } from './auth.services.js'
import * from'../DTO/auth.dto.js' //TODO: 로그인 request response dto 찾아서 넣기.

export class Controller {
    constructor(
      private readOnly service: Service
    ) {}

    loginHandler: RequestHandler = async (req, res, next) => {
      const { username, password }  = req.body; //TODO: insert request response dto type
      const data = this.service.login({ username, password });//TODO: insert types
      res.status(200).send(data);
    }

    logoutHandler: RequestHandler = async (req, res, next) => {}
    
    refreshTokenHandler: RequestHandler = async (req, res, next) => {}
}
