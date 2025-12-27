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
    try{
      const exUser = await prisma.user.findUnique({
        where: { username },
      });
      console.log("exUser", exUser);
      if (exUser){
        const result = await bcrypt.compare( password, exUser.password);
        if (result) { 
          return cb(null, exUser)
        } else { 
          return cb(null, false, { message: "invalid password" });
        }
      } else {
        return cb(null, false, { message : "invalid user" })
      }
    } catch (error){
      return cb(error)
    }
  }
);
