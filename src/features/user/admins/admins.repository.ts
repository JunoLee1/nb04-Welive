import type { RequestHandler } from "express";
import prisma from "../../../lib/prisma.js"

export class Repository {
    constructor(){};
    /*
    findMany = async() => {
        const result = await prisma.user.findMany({
            where:{
                
            }
        })
    }
    */
    findById = async (id: string) => {
        const userId = await prisma.user.findUnique({
            where:{
                id,
            }
        })
        return userId;
    }

    findByEmail = async(email: string) => {
        const userEmail = await prisma.user.findUnique({
            where:{
                email
            }
        })
        return userEmail
    }
}