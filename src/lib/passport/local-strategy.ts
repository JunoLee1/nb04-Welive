import { Strategy as LocalStrategy } from "passport-local";
import prisma from "../prisma.js";
import bcrypt from "bcrypt";

type VerifyCallBack = (error: any, user?: any, info?: any) => void;

export const localStrategy = new LocalStrategy(
  {
    usernameField: "username",
    passwordField: "password",
  },
  async (username: string, password: string, cb: VerifyCallBack) => {
    try {
      console.log(1)
      const user = await prisma.user.findUnique({
        where: { username },
      });
      if (!user)
        return cb(null, false, { message: "존재 하지 않는 유저 입니다" });

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return cb(null, false, { message: "틀린 비밀번호 입니다" });
      } else {
        return cb(null, user);
      }
    } catch (error) {
      return cb(error)
    }
  }
);
