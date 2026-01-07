import { HttpError } from "../../../../lib/middleware/error.middleware/httpError.js";
import type {
  StatusAction,
  AdminsCreateResponseDTO,
  RequestPayloadDTO,
  AdminsModifiedRsponseDTO,
} from "../admin.dto.js";
import { Repository } from "./admin-id.repo.js";
import type { Multer } from "multer";
import { deleteImageToS3, uploadImageToS3 } from "../../../../lib/middleware/S3.Client.js";
const repo = new Repository();
export class Service {
  constructor(readonly repo: Repository) {}
  modifyUserInfo = async (
    id: string,
    input: RequestPayloadDTO
  ): Promise<AdminsModifiedRsponseDTO> => {
    const { contact, username, email, adminOf, avatar } = input;
    const existingUser = await repo.findOne("id", id);
    if (!existingUser) throw new HttpError(404, "NotFound");
    let profileImageKey = existingUser.avatar; // 기존 key 유지

    if (avatar) {
      // 1️⃣ 기존 이미지 삭제
      if (profileImageKey) {
        await deleteImageToS3(profileImageKey);
      }

      // 2️⃣ 새 이미지 업로드
      const uploadedKey = await uploadImageToS3(avatar);
      profileImageKey = uploadedKey;
    }
    const admin = await this.repo.modifyUserInfo(id,{ contact, username, email, adminOf, avatar });
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
