import type { passwordDTO } from "./me.dto.js";
import { Repository } from "./me.repo.js";
export class Service {
  constructor(readonly repo: Repository) {}
  modifiedAvatar = async (id: string, avatarImage: string) => {
    this.repo.modifiedAvatar(id, avatarImage);
  };

  modifiedPassword = async (
    id: string,
    { password, newPassword }: passwordDTO
  ) => {
    this.repo.modifiedPassword(id, { password, newPassword });
  };
}
