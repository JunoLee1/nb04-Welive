import {
  deleteImageToS3,
  uploadImageToS3,
} from "../../../../lib/middleware/S3.Client.js";
import { HttpError } from "../../../../lib/middleware/error.middleware/httpError.js";
import type {
  StatusAction,
  AdminsCreateResponseDTO,
  RequestPayloadDTO,
  AdminsModifiedResponseDTO
} from "../admin.dto.js";
import { Repository } from "./admin-id.repo.js";

const repo = new Repository();
export class Service {
  constructor(readonly repo: Repository) {}
  modifyUserInfo = async (
    id: string,
    input: RequestPayloadDTO
  ): Promise<AdminsModifiedResponseDTO> => {
    const { email, username, adminOf, contact, avatar } = input;
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

    const admin = await this.repo.modifyUserInfo(id, {
      email,
      username,
      adminOf,
      contact,
      avatar,
    });
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
