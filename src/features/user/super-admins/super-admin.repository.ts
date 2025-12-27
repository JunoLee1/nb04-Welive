import prisma from '../../../lib/prisma.js'
export class Repository {
    constructor(){}
    findUniqueEmail = async (email: string) => {
        const user = await prisma.user.findUnique({
            where:{
                email
            }
        })
        return user;
    }
    findUniqueUsername = async(username: string) => {
        const user =  await prisma.user.findUnique({
            where: {
                username: username
            }
        })
        return user;
    };

    findUniquePhoneNumber = async(contact: string) => {
        const phoneNumber = await prisma.user.findUnique({
            where:{
                contact
            }
        })
         return phoneNumber;
    }
}