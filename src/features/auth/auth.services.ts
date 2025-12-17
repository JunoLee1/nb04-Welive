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
      where: { username },
      select: {
        id: true,
        username: true,
        email: true,
        avatar: true,
        isActive: true,
        role: true,
        contact: true,
        joinStatus: true,
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
      },
    });

    if (!user) {
      throw new Error("User not found");
    }
    return user;
  };
  //❗️unique
}
// 물어볼거 : 결과
