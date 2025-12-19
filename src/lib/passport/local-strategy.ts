import { Strategy as LocalStrategy } from "passport-local";
import prisma from "../prisma.js";
import bcrypt from "bcrypt";

type VerifyCallBack = (error: any, user?: any, info?: any) => void;

export const localStrategy = new LocalStrategy(
  {
    usernameField: "username",
    passwordField: "password",
  },
  async (username: string, passowrd: string, cb: VerifyCallBack) => {
    try {
      const user = await prisma.user.findUnique({
        where: {
          username
        },
      });
      if (!user || !user.password)
        return cb(null, false, " 존재 하지 않는 입니다");

      const isMatch = await bcrypt.compare(passowrd, user.password);

      if (!isMatch) {
        return cb(null, false, "틀린 비밀번호 입니다");
      } else {
        cb(null, user);
      }
    } catch (error) {
      cb(error)
    }
  }
);
