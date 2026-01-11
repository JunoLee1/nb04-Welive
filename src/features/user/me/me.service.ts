import type { PasswordDTO } from "./me.dto.js";
import { Repository } from "./me.repo.js";
export class Service {
  constructor(readonly repo: Repository) {}
  modifiedAvatar = async (id: string, avatarImage: string) => {
    await this.repo.modifiedAvatar(id, avatarImage);
  };

  modifiedPassword = async (
    id: string,
    { password, newPassword }: PasswordDTO
  ) => {
    await this.repo.modifiedPassword(id, { password, newPassword });
  };
}
