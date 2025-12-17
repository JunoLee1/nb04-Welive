import { join } from "node:path";
import prisma from "../../lib/prisma.js";
import type { LoginRequestDTO, LoginResponseDTO } from "../DTO/auth.dto.js";

export class Service {
  constructor() {}

  login = async ({
    username,
    password,
  }: LoginRequestDTO): Promise<LoginResponseDTO> => {
    //unique checker
    const user = await prisma.user.findFirst({
      where: {
        username: username,
      },
      select: {
        adminOf: {
          select: {
            id: true,
            name: true,
          },
        },
        resident: {
          select: {
            id: true,
            apartmentId: true,
            building: true,
            unit: true,
            isHouseholder: true,
          },
        },
        include: {
          id: true,
          username: true,
          email: true,
          avartar: true,
          isActive: true,
          roles: true,
          contacts: true,
          joinSratus: true,
        },
      },
    });
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  };
  //❗️unique
}
