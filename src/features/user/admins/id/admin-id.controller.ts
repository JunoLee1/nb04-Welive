import type { RequestHandler } from "express"

export class Controller{
    contructor(){};

    modifyStatus:RequestHandler = (req, res, next) => {};
    modifyAdminInfo:RequestHandler = (req, res, next) => {};
    deleteAdmin:RequestHandler = (req, res, next) => {};
}