import { HttpError } from "../../../lib/middleware/error.middleware/httpError.js";
import type { passwordDTO } from "./me.dto.js";
import prisma from "../../../lib/prisma.js";

import bcrypt from "bcrypt";
export class Repository {
  modifiedPassword = async (
    id: string,
    { password, newPassword }: passwordDTO
  ) => {
    const user = await this.findById(id);
    if (!user) throw new HttpError(404, "유저가 존재 하지 않습니다");

    const isMatch = await bcrypt.compare(password, user.password); // 현재 비밀번호가 다른 경우
    if (!isMatch)
      throw new HttpError(
        400,
        "잘못된 요청(필수사항 누락 또는 잘못된 입력값)입니다."
      );

    const isSameWithOlder = await bcrypt.compare(newPassword, user.password);
    if (isSameWithOlder)
      throw new HttpError(
        400,
        "잘못된 요청(필수사항 누락 또는 잘못된 입력값)입니다."
      );
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    const result = await prisma.user.update({
      where: {
        id,
      },
      data: {
        password: hashedNewPassword,
      },
    });
    return result;
  };

  findById = async (id: string) => {
    const result = await prisma.user.findUnique({
      where: { id },
    });
    return result;
  };
  
  modifiedAvatar = async () => {};
}
