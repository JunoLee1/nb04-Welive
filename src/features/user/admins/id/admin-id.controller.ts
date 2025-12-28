import type { RequestHandler } from "express";
import { Service } from "./admin-id.service.js";
import { Repository } from "./admin-id.repo.js";
import { HttpError } from "../../../../lib/middleware/error.middleware/httpError.js";
const repo = new Repository();
const service = new Service(repo);
export class Controller {
  contructor(service: Service) {}

  modifyUserInfo: RequestHandler = async (req, res, next) => {
    console.log("received from Client");
    const { id } = req.params;
    const user = req.user
    const userId = user?.id
    if (!userId) throw new HttpError(401,"unauthorized") 
    
    await service.modifyUserInfo(userId)
    
    return res.status(204).json();
  };
  modifyJoinStatus: RequestHandler = async (req, res, next) => {
    const { id } = req.params;
    const { joinStatus } = req.body;

    const user = req.user
    const userId = user?.id

    if (!userId) throw new HttpError(401,"unauthorized") 
    await service.modifyStatus( userId, joinStatus)
    return res.status(204).json();
  };
  deleteAdmin: RequestHandler = async (req, res, next) => {
    const { id } = req.params;
     const user = req.user
    const userId = user?.id

    if (!userId) throw new HttpError(401,"unauthorized") 
    await service.deleteAdmin( userId )
    return res.status(204).json();

  };
}
