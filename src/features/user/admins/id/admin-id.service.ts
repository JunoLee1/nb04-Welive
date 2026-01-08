import {
  deleteImageToS3,
  uploadImageToS3,
} from "../../../../lib/middleware/S3.Client.js";
import { HttpError } from "../../../../lib/middleware/error.middleware/httpError.js";
import type {
  StatusAction,
  AdminsCreateResponseDTO,
  RequestPayloadDTO,
  AdminsModifiedResponseDTO,
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
    console.log("id", id);
    const existingUser = await this.repo.findOne("id", id);
    console.log("existingUser:", existingUser);
    if (!existingUser) throw new HttpError(404, "NotFound");
    let profileImageKey = existingUser.avatar || undefined; // 기존 key 유지
    console.log(1234);
    if (avatar) {
      if (typeof avatar === "string") {
        // 테스트나 이미 업로드된 URL이라면 그대로 사용
        profileImageKey = avatar;
      } else {
        // Multer File 객체
        if (profileImageKey) await deleteImageToS3(profileImageKey);
        const uploadedKey = await uploadImageToS3(avatar);
        profileImageKey = uploadedKey;
      }
      console.log(12345);
    }

    const updatedUser = {
      ...existingUser,
      id: existingUser.id,
      ...(input.username !== undefined && { username: input.username }),
      ...(input.email !== undefined && { email: input.email }),
      ...(input.adminOf !== undefined && { adminOf: input.adminOf }),
      ...(input.avatar !== undefined && { avatar: profileImageKey }),
    };
    const admin = await this.repo.modifyUserInfo(id, updatedUser);
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
