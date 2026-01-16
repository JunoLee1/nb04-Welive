import prisma from '../../../lib/prisma.js'
export class Repository {
    constructor(private prisma: any){}
    findUniqueEmail = async (email: string) => {
        const user = await this.prisma.user.findUnique({
            where:{
                email,
                role: "SUPER_ADMIN"
            }
        })
        return user;
    }
    findUniqueUsername = async(username: string, role: string) => {
        const user =  await this.prisma.user.findUnique({
            where: {
                username: username,
                role: "SUPER_ADMIN"
            }
        })
        return user;
    };

    findUniquePhoneNumber = async(contact: string) => {
        const phoneNumber = await this.prisma.user.findUnique({
            where:{
                contact,
                role: "SUPER_ADMIN"
            }
        })
         return phoneNumber;
    }
    createSuperAdmin = async (data:any) => {
        const newSuperAdmin = await this.prisma.user.create({
            data
        })
        return newSuperAdmin;
    }
}