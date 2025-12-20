import type {RequestHandler} from 'express'
export class Controller {
    constructor(){};

    register: RequestHandler = (req, res, next) => {}
    accessList:RequestHandler = (req, res, next) => {}
    modifyStatus:RequestHandler = (req, res, next) => {}
    deleteAdmins:RequestHandler = (req, res, next) => {}

}