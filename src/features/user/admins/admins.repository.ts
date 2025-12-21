import prisma from "../../../lib/prisma.js"
import type { RequestBody } from './admin.dto.js';
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
            },
        })
        return userId;
    }
    findByUsername = async(username: string) => {
        const userName = await prisma.user.findUnique({
            where:{ username },
        });
        return userName
     }
    findByEmail = async(email: string) => {
        const userEmail = await prisma.user.findUnique({
            where:{
                email
            },
        })
        return userEmail;
    }
    createAdmin = async( input: RequestBody ) => {
        const newAdmin = await prisma.user.create({
            data:{
                email:input.email ?? "",
                username:input.username ??"",
                name: input.name ?? "",
                password: input.password ?? "",
                contact: input.contact ?? "",
                role: "ADMIN" ,
                avatar: input.avatar ?? ""
            },
            select:{
                id:true,
                email:true,
                username:true,
                name:true,
                contact:true,
                role:true,
                isActive: true,
                hasNext: true,
                avatar:true,
                adminOf:{
                    select:{
                        id: true,
                        name: true,
                        createdAt: true,
                        updatedAt:true,
                        address: true,
                        description: true,
                        buildingNumberFrom: true,
                        buildingNumberTo: true,
                        floorCountPerBuilding: true,
                        unitCountPerFloor: true,
                        officeNumber: true,
                        adminId: true,
                    },
                }
            }
        })
        return newAdmin;
    }
}