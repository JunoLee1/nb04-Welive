import type { RequestHandler } from 'express';
import { Service } from './admins.service.js';
import type { RequestBody } from './admin.dto.js';
import { Repository } from './admins.repository.js';

const repo =  new Repository()
const service = new Service( repo);
export class Controller {
    constructor(){};

    register: RequestHandler = async(req, res, next) => {
        const { email, name, username, password, avatar, contact} :RequestBody = req.body;
        await service.register({ email, name, username, password, avatar, contact })
    }
    accessList:RequestHandler = (req, res, next) => {}
    modifyStatus:RequestHandler = (req, res, next) => {}
    deleteAdmins:RequestHandler = (req, res, next) => {}

}