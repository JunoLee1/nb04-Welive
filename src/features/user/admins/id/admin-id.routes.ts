import { Router } from 'express';
import { Controller } from './admin-id.controller.js'

const adminRouter = Router();
const controller = new Controller();

// patch an admin Join status API
// address : users/admins/{id}/joinStatus
adminRouter.patch("/joinStatus",
    //TODO: check the user super-admin
    //TODO: validate
    controller.modifyStatus
)

// Patch an admin user info
// address : users/admins/{id}
adminRouter.patch("/",
    //TODO: check the user super-admin
    //TODO: validate
    controller.modifyAdminsInfo
)

// delete admin account API
// address : users/admins/{id}
adminRouter.delete("/",
    controller.deleteAdmin
)

export default adminRouter;