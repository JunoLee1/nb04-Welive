import { Router } from 'express';
import { Controller } from "./admins.controller.js";
import { id } from './id/admin-id.routes.js'
const controller = new Controller();
const router = Router();

router.use(`/${id}`,id)
// create admin Api
// address : users/admins
router.post("/",
    //TODO: add validator
    controller.register
)

// access admins API
// address : users/admins
router.get("/",
    //TODO: check the user is super admin
    //TODO: add validator
    controller.accessList
)

// patch the admins Join status API
// address : users/admins/joinStatus
router.patch("/joinStatus",
    //TODO: check the user is super admin
    //TODO: add validator
    controller.modifyStatus
)


// delete rejected Admin user
// address : users/admins/
router.delete('/',
    //TODO: check the user is super admin
    //TODO: add validator
    controller.deleteAdmins
)
export default router;