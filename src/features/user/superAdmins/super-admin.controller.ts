import { RequestHandler } from "express";
import { SuperAdminCreateReqDTO } from "./super-admin.dto";
//import {Service} from "./super-admin.controller"

//const service = new Service()
export class Controller {
    signUpHandler:RequestHandler = async (req, res, next) => {
        console.log("received from routes")
        const {email, password, name, username, contact} = req.body// validated value from validator
        //service.signUpHandler({email, password, name, username, contact}: SuperAdminCreateReqDTO );
        console.log("✅ result")
        return res.status(200);
    }
}