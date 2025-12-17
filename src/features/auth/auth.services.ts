import type { User } from "../../../prisma/generated/client.js";
import prisma from "../../lib/prisma.js";
import type { LoginRequestDTO, LoginResponseDTO } from "../DTO/auth.dto.js";
import bcrypt from "bcrypt";
export class Service {
  constructor() {}

  login = async ({
    username,
    password,
  }: LoginRequestDTO): Promise<LoginResponseDTO> => {
   
    //unique checker

    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        email: true,
        password: true,
        avatar: true,
        isActive: true,
        role: true,
        contact: true,
        adminOf: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    if (!user) {
      throw new Error("User not found");
    }
     const passwordCheker = await bcrypt.compare(password, user.password)
     if(!passwordCheker){
      throw new Error("Invalid password");
     }
     //TODO: 토근 발급 
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      contact: user.contact,
      avatar: user.avatar,
      isActive: user.isActive,
      role: user.role,
      adminOf: user.adminOf,
    }
  };
}
