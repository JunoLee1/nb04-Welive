import type { StatusAction, AdminsCreateResponseDTO } from "../admin.dto.js";
import { Repository } from "./admin-id.repo.js";

const repo = new Repository();
export class Service {
  constructor(readonly repo: Repository) {}
  modifyUserInfo = async (id: string): Promise<AdminsCreateResponseDTO> => {
    const admin = await this.repo.modifyInfo(id);
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
