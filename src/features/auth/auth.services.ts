import prisma from "../../lib/prisma.js";
import { HttpError } from "../../lib/middleware/error.middleware/httpError.js";
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
      throw new HttpError(
        400,
        "잘못된 요청(필수사항 누락 또는 잘못된 입력값)입니다."
      );
    }
    // password checker
    const passwordCheker = await bcrypt.compare(password, user.password);
    if (!passwordCheker) {
      throw new HttpError(
        400,
        "잘못된 요청(필수사항 누락 또는 잘못된 입력값)입니다."
      );
    }
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      contact: user.contact,
      avatar: user.avatar ?? "",
      isActive: user.isActive,
      role: user.role,
      adminOf: user.adminOf,
    };
  };
}
