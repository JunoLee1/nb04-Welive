import { HttpError } from '../../../lib/middleware/error.middleware/httpError.js';
import type { RequestBody, AdminsCreateResponseDTO} from './admin.dto.js';
import  {Repository} from './admins.repository.js'
export class Service {
    constructor(
       readonly repo: Repository
    ){}

    register = async(input: RequestBody):Promise<AdminsCreateResponseDTO> => {
        const { email, name, username, password, avatar } = input;
        console.log("⚓️receivded:", email, name, username, password, avatar);
        const duplicatedEmail = await this.repo.findByEmail(email);
        if( duplicatedEmail ) throw new  HttpError(400, "해당 이메일은 이미 존재하는 이메일 입니다.");//TODO:fix error message
        const duplicatedUsername = await this.repo.findByUsername( username );
        if( duplicatedUsername ) throw new  HttpError(400, "해당 이메일은 이미 존재하는 유저 아이디 입니다.");
        
        const newAdmin = this.repo.createAdmin(input);
        //TODO: 토큰 생성
        const result = {
            ...newAdmin
        }
        console.log("✌️result: ",result)
        return result;
    }
}