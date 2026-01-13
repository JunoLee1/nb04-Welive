import { jest, describe, it, expect } from "@jest/globals";
import { generateToken } from "../../lib/tokens.js";
describe("token generator", () => {
  it("access, refresh 토큰 생성", () => {
    const token = generateToken("user-id");
    expect(token).toHaveProperty("accessToken");
    expect(token).toHaveProperty("refreshToken");
    expect(typeof token.accessToken).toBe("string");
    expect(typeof token.refreshToken).toBe("string");
  });
});
