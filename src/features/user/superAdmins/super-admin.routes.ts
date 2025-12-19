import { Router } from "express"
import  { superAdminSignUpSchema }from "./super-admin.validator.js"
import { Controller } from './super-admin.controller.js'
import { validate } from "../../../lib/middleware/validator.js";


// create super admin post API
const router = Router();
const controller = new Controller();

router.post('/super-admins',
    //TODO: type check. for request body (user name, contact, password)
    validate(superAdminSignUpSchema, "body"),
    controller.signUpHandler
)

   
export default router