import { Router, type RequestHandler } from "express"
import { Controller } from './super-admin.controller.js'

// create super admin post API
const router = Router();

router.post('/super-admins',

    //TODO: type check. for request body (user name, contact, password)
    //controller.signUpHandler
)

   
export default router