import { Router } from 'express';
import { Controller } from "./admins.controller.js";
import  idRouter  from './id/admin-id.routes.js';
import { validate } from '../../../lib/middleware/validator.js';
import  { requestBodySchema, requestQuerySchema, joinStatusSchema } from './admins.validation.js'
const controller = new Controller();
const router = Router();

router.use('/id', idRouter)
// create admin Api
// address : users/admins
router.post("/",
    validate( requestBodySchema, 'body'),
    controller.register
)

// access admins API
// address : users/admins
router.get("/",
    //TODO: check the user is super admin
    validate(requestQuerySchema,'query'),
    controller.accessList
)

// patch the admins Join status API
// address : users/admins/joinStatus
router.patch("/joinStatus",
    //TODO: check the user is super admin
    validate(joinStatusSchema,'body'),
    controller.modifyStatus
)


// delete rejected Admin user
// address : users/admins/
router.delete('/',
    //TODO: check the user is super admin
    controller.deleteAdmins
)
export default router;