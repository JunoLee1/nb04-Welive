import { Router } from "express";
const router = Router();
import superAdminsApi from "./super-admins/super-admin.routes.js"
/**
 * API user feature entry router
 *  api/V2/users/ 
 - super admins
 - admins
 - residents
 - me
 */
router.use("/super-admins",superAdminsApi);
// router.use("/admins",adminsApi);
// router.use("/residents",residentsApi);
// router.use("/me",userInfoApi);

export default router