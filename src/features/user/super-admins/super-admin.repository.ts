import prisma from '../../../lib/prisma.js'
export class Repository {
    constructor(private prisma: any){}
    findUniqueEmail = async (email: string) => {
        const user = await this.prisma.user.findUnique({
            where:{
                email
            }
        })
        return user;
    }
    findUniqueUsername = async(username: string) => {
        const user =  await this.prisma.user.findUnique({
            where: {
                username: username
            }
        })
        return user;
    };

    findUniquePhoneNumber = async(contact: string) => {
        const phoneNumber = await this.prisma.user.findUnique({
            where:{
                contact
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