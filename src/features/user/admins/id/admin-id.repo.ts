import prisma from "../../../../lib/prisma.js";
type findUniqueKey = "id" | "email" | "username"| "contact";

const buildWhereClause = (field:findUniqueKey, value: string ) => {
    switch(field){
        case "id":
            return {id: value}
        case "email":
            return {email: value}
        case "username":
            return {username: value}
         case "contact":
            return {contact: value}
    }
};

export class Repository {
    
    constructor(){}
    findOne = async(field:findUniqueKey,value: string) => {
        const where = buildWhereClause(field, value)
        const result = await prisma.user.findUnique({ where })
        return result
    }
    modifyInfo = async(id: string) => {
        const result = await prisma.user.update({
            where:{id},//TODO: 관리자 수정시 리턴 타입
            data:{}
        })
        return result;
    }
    delete = async(id: string) => {
        await prisma.user.delete({
            where:{id},
        })
        return ;
    }
}
