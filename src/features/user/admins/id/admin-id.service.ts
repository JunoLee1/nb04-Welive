import type {
  StatusAction,
  AdminsCreateResponseDTO,
  RequestPayloadDTO,
} from "../admin.dto.js";
import { Repository } from "./admin-id.repo.js";

const repo = new Repository();
export class Service {
  constructor(readonly repo: Repository) {}
  modifyUserInfo = async (
    id: string,
    input: RequestPayloadDTO
  ): Promise<AdminsCreateResponseDTO> => {
    const admin = await this.repo.modifyInfo(id, input);
    return admin;
  };

  modifyStatus = async (
    id: string,
    joinStatus: StatusAction
  ): Promise<AdminsCreateResponseDTO> => {
    const admin = await this.repo.modifyStatus(id, joinStatus);
    return admin;
  };
  deleteAdmin = async (id: string): Promise<void> => {
    await this.repo.delete("id", id);
    return;
  };
}
