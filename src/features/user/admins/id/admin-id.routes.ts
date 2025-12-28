import { Router } from "express";
import { Controller } from "./admin-id.controller.js";

const idRouter = Router();
const controller = new Controller();

// patch an admin Join status API
// address : users/admins/{id}/joinStatus
idRouter.patch(
  "/joinStatus",
  //TODO: check the user super-admin
  //TODO: validate
  //TODO:TEST
  controller.modifyJoinStatus
);

// Patch an admin user info
// address : users/admins/{id}
idRouter.patch(
  "/",
  //TODO: check the user super-admin
  //TODO: validate
    //TODO:TEST
  controller.modifyUserInfo
);

// delete admin account API
// address : users/admins/{id}
  //TODO:TEST
idRouter.delete("/", controller.deleteAdmin);
  //TODO:TEST

export default idRouter;
