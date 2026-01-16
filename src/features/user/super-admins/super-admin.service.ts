import { HttpError } from "../../../lib/middleware/error.middleware/httpError.js";
import type {
  SuperAdminCreateReqDTO,
  SuperAdminCreateResDTO,
} from "./super-admin.dto.js";
import { Repository } from "./super-admin.repository.js";
import bcrypt from "bcrypt"
export class Service {
  constructor(readonly repository: Repository) {}

  signUpHandler = async ({
    email,
    password,
    name,
    username,
    contact,
    avatar
  }: SuperAdminCreateReqDTO):Promise<SuperAdminCreateResDTO>=> {
   const userEmail = await this.repository.findUniqueEmail(email);
   if(userEmail) throw new HttpError(400, "잘못된 요청 입니다.");
    const userPhoneNumber = await this.repository.findUniquePhoneNumber(contact);
    if(userPhoneNumber) throw new HttpError(400, "잘못된 요청 입니다.");
    const userName = await this.repository.findUniqueUsername(username,"SUPER_ADMIN");;
    if(userName)  throw new HttpError(400, "잘못된 요청 입니다.");
    const hashedPassword = await bcrypt.hash(password, 10)
    const data = await this.repository.createSuperAdmin({
        email:userEmail,
        password:hashedPassword,
        name,
        contact: userPhoneNumber,
        username:userName,
        approvedAt: null,
        joinStatus: "APPROVED",
        role: "SUPER_ADMIN",
        avatar: null
    })
    return data
  };
}
