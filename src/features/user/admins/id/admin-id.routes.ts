import { Router } from 'express';
import { Controller } from './admin-id.controller.js'

const router = Router();
const controller = new Controller();

// patch an admin Join status API
// address : users/admins/{id}/joinStatus
router.patch("/joinStatus",
    //TODO: check the user super-admin
    //TODO: validate
    controller.modifyStatus
)

// Patch an admin user info
// address : users/admins/{id}
router.patch("/",
    //TODO: check the user super-admin
    //TODO: validate
    controller.modifyAdminsInfo
)

// delete admin account API
// address : users/admins/{id}
router.delete("/",
    controller.deleteAdmin
)
