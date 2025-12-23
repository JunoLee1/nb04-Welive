import { HttpError } from "../../../lib/middleware/error.middleware/httpError.js";
import type {
  SuperAdminCreateReqDTO,
  SuperAdminCreateResDTO,
} from "./super-admin.dto.js";
import { Repository } from "./super-admin.repository.js";
import prisma from "../../../lib/prisma.js";

export class Service {
  constructor(readonly repository: Repository) {}

  signUpHandler = async ({
    email,
    password,
    name,
    username,
    contact
  }: SuperAdminCreateReqDTO):Promise<SuperAdminCreateResDTO>=> {
    console.log("⚓️ received from controller:",email, password, name, contact, username)
   const userEmail = this.repository.findUniqueEmail(email);
   if(!userEmail) throw new HttpError(400, "잘못된 요청 입니다.");
    const userPhoneNumber = this.repository.findUniquePhoneNumber(contact);
    if(!userPhoneNumber) throw new HttpError(400, "잘못된 요청 입니다.");
    const userName = this.repository.findUniqueUsername(username);
    if(!userName)  throw new HttpError(400, "잘못된 요청 입니다.");
    console.log("✅ finished prunning");
    const DATA = await prisma.user.create({
        data:{
            email,
            password,
            name,
            contact,
            username,
            approvedAt: null,
            joinStatus: "APPROVED",
            role: "SUPER_ADMIN",
            avatar: null
        }
    })
    return DATA;
  };
}
