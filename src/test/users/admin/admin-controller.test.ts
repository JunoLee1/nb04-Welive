import { jest, describe, it, expect } from "@jest/globals";
import { Controller } from "../../../features/user/admins/admins.controller.js";
import { Service } from "../../../features/user/admins/admins.service.js";
import { Controller as adminIdController } from "../../../features/user/admins/id/admin-id.controller.js";
import { Service as adminIdService } from "../../../features/user/admins/id/admin-id.service.js";
import { Repository as adminIdRepo } from "../../../features/user/admins/id/admin-id.repo.js";
import { Repository } from "../../../features/user/admins/admins.repository.js";
import { accessTokenStrategy } from "../../../lib/passport/jwt-strategy.js";
import { HttpError } from "../../../lib/middleware/error.middleware/httpError.js";

jest.mock("../../../features/user/admins/id/admin-id.service.js");
jest.mock("../../../features/user/admins/id/admin-id.repo.js");
jest.mock("../../../features/user/admins/admins.service.js");
jest.mock("../../../lib/passport/jwt-strategy.js", () => ({
  accessTokenStrategy: {
    get: jest.fn(),
  },
}));

interface JWTpayload {
  sub: string;
  email: string;
  role: "ADMIN" | "USER" | "SUPER_ADMIN";
}

describe("관리자 컨트롤러 테스트", () => {
  describe("관리자 생성 컨트롤러", () => {
    let controller: Controller;
    let serviceMock: jest.Mocked<Service>;
    let req: any;
    let res: any;
    let next: any;
    beforeEach(() => {
      req = {
        body: {
          name: "test",
          contact: "01011112222",
          username: "testuser",
          password: "1234",
          email: "test@test.com",
          avatar: null,
        },
      };
      res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
        json: jest.fn(),
        end: jest.fn(),
      };
      (next = jest.fn()),
        (serviceMock = {
          repo: {} as any,
          accessList: jest.fn(),
          registerAdmin: jest.fn(),
          modifyStatus: jest.fn(),
          deleteRejectedAdmins: jest.fn(),
        });
      controller = new Controller(serviceMock);
    });
    it("서비스로부터 서비스 값을 반환 성공 -> 204", async () => {
      jest.spyOn(serviceMock, "registerAdmin").mockResolvedValue(undefined);
      await controller.register(req, res, next);

      expect(serviceMock.registerAdmin).toHaveBeenCalledTimes(1);
      expect(serviceMock.registerAdmin).toHaveBeenCalledWith(req.body);

      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.end).toHaveBeenCalledWith();
    });
    it("서비스로부터 서비스 값을 반환 실패 -> 500", async () => {
      const error = new Error("서버 오류");
      jest.spyOn(serviceMock, "registerAdmin").mockRejectedValue(error);

      await controller.register(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.end).not.toHaveBeenCalledWith();
    });
  });
  //=================================================================
  describe("관리자 목록 조회 컨트롤러", () => {
    let controller: Controller;
    let service: Service;
    let repo: Repository;
    let req: any;
    let res: any;
    let next: any;
    interface ErrorTypes {
      status: 500 | 400 | 401 | 403;
      message: "인증과 관련된 에러 입니다" | "권한과 관련된 에러 입니다";
    }

    beforeEach(() => {
      req = {
        query: {
          page: 1,
          limit: 10,
          searchKeyword: "",
          joinStatus: "PENDING",
        },
        user: undefined,
      };
      res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
        json: jest.fn(),
        end: jest.fn(),
      };
      next = jest.fn();
      repo = new Repository();
      service = new Service(repo);
      controller = new Controller(service);
      jest.clearAllMocks();
    });
    describe("실패 케이스", () => {
      // 입구 컷
      it("인증 실패 -> 401", async () => {
        const mockPayload: JWTpayload = {
          sub: "user-id-123",
          role: "ADMIN",
          email: "test@test.com",
        };
        const mockJwtVerify: jest.Mock = jest.fn((mockPayload, done: any) => {
          done(new HttpError(401, "인증 실패"), null);
        });

        jest
          .spyOn(accessTokenStrategy, "authenticate")
          .mockImplementation(mockJwtVerify);
        await controller.accessList(req, res, next);

        expect(next).toHaveBeenCalledWith(
          expect.objectContaining({
            status: 401, // HttpError의 속성명 확인 필요
            message: "인증과 관련된 오류입니다.",
          })
        );

        expect(res.status).not.toHaveBeenCalled();
        expect(res.end).not.toHaveBeenCalledWith();
      });
      // 인증만 통과
      it("권한 없음 -> 403", async () => {
        req.user = {
          sub: "user-id-123",
          role: "ADMIN",
          email: "test@test.com",
        };

        await controller.accessList(req, res, next);

        expect(req.user.role).not.toBe("SUPER_ADMIN");

        expect(next).toHaveBeenCalledWith(
          expect.objectContaining({
            status: 403, // HttpError의 속성명 확인 필요
            message: "권한과 관련된 오류입니다.",
          })
        );
        expect(res.status).not.toHaveBeenCalled();
        expect(res.end).not.toHaveBeenCalledWith();
      });
      // 인증 && 권한  통과
      it("서비스로부터 서비스 값을 반환 실패 -> 500", async () => {
        req.user = {
          sub: "user-id-123",
          role: "SUPER_ADMIN",
          email: "test@test.com",
        };

        jest.spyOn(service, "accessList").mockImplementation(() => {
          throw new HttpError(500, "알 수 없는 에러 입니다.");
        });

        await controller.accessList(req, res, next);
        expect(next).toHaveBeenCalledWith(
          expect.objectContaining({
            status: 500, // HttpError 속성명 확인
            message: "알 수 없는 에러 입니다.",
          })
        );
        expect(res.status).not.toHaveBeenCalled();
        expect(res.end).not.toHaveBeenCalledWith();
      });
    });
    describe("성공", () => {
      it("서비스로부터 서비스 값을 반환 성공 -> 200", async () => {
        req.user = {
          sub: "user-id-123",
          role: "SUPER_ADMIN",
          email: "test@test.com",
        };
        jest.spyOn(service, "accessList").mockResolvedValue({
          data: [],
          totalCount: 0,
          hasNext: false,
        });
        await controller.accessList(req, res, next);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
          data: {
            data: [],
            totalCount: 0,
            hasNext: false,
          },
        });
      });
    });
  });

  //=================================================================
  describe("관리자 정보 수정 컨트롤러", () => {
    let res: any;
    let req: any;
    let next: any;
    let service: adminIdService;
    let controller: adminIdController;
    let repo: adminIdRepo;
    beforeEach(() => {
      res = {
        status: jest.fn(),
        end: jest.fn(),
      };
      (req = {
        body: {
          username: "hana lee",
        },
        user: { id: "admin-1" },
        params: { id: "admin-1" }, // ✅ 반드시 필요
      }),
        (next = jest.fn()),
        (repo = new adminIdRepo());
      service = new adminIdService(repo);
      controller = new adminIdController(service);
    });
    describe("실패 케이스", () => {
      it("인증 실패 -> 401", async () => {
        //1️⃣ given
        req.user = undefined;
        //2️⃣ when
        await controller.modifyUserInfo(req, res, next);
        //3️⃣ then
        expect(next).toHaveBeenCalledWith(
          expect.objectContaining({
            status: 401,
            message: "인증과 관련된 오류 입니다.",
          })
        );
        expect(res.status).not.toHaveBeenCalledWith(204);
        expect(res.end).not.toHaveBeenCalled();
      });
      it("권한 없음 -> 403", async () => {
        //1️⃣ given
        req.user = {
          id: "admin-1",
          role: "ADMIN",
        };
        //2️⃣ when
        await controller.modifyUserInfo(req, res, next);
        //3️⃣ then
        expect(req.user.role).not.toBe("SUPER_ADMIN");
        expect(next).toHaveBeenCalledWith(
          expect.objectContaining({
            status: 403,
            message: "권한과 관련된 오류입니다.",
          })
        );
      });
      it("서비스로부터 서비스 값을 반환 실패 -> 500", async () => {
        //1️⃣ given
        req.user = {
          id: "admin-1",
          role: "SUPER_ADMIN",
        };
        //2️⃣ when
        jest.spyOn(service, "modifyUserInfo").mockImplementation(() => {
          throw new HttpError(500, "알 수 없는 오류 입니다.");
        });
        await controller.modifyUserInfo(req, res, next);
        //3️⃣ then
        expect(next).toHaveBeenCalledWith(
          expect.objectContaining({
            status: 500,
            message: "알 수 없는 오류 입니다.",
          })
        );
      });
    });
    it("서비스로부터 서비스 값을 반환 성공 -> 204", async () => {
      //1️⃣ given
      req.user = {
        id: "admin-1",
        role: "SUPER_ADMIN",
      };
      req.body = {
        contact: "01011112222",
      };
      const mockResponse = {
        id: "admin-1",
        role: "SUPER_ADMIN",
        contact: "01011112222",
        username: "hana",
        name: "hana lee",
        email: "test@test.com",
        avatar: null,
        isActive: true,
        approvedAt: null,
        adminOf: null,
      };
      //2️⃣ when
      jest.spyOn(service, "modifyUserInfo").mockResolvedValue(mockResponse);
      await controller.modifyUserInfo(req, res, next);
      //3️⃣ then
      expect(res.status).toHaveBeenCalledWith(204);
    });
  });

  //=================================================================

  describe("관리자 가입 상태 수정 컨트롤러", () => {
    let service: adminIdService;
    let controller: adminIdController;
    let repo: adminIdRepo;
    let req: any;
    let res: any;
    let next: any;
    beforeEach(() => {
      res = {
        status: jest.fn(),
        end: jest.fn(),
      };
      req = {
        body: {
          joinStatus: "APPROVED",
        },
        user: { id: "admin-1" },
        params: { id: "admin-1" }, // ✅ 반드시 필요
      };
      next = jest.fn();
      repo = new adminIdRepo();
      service = new adminIdService(repo);
      controller = new adminIdController(service);
      jest.clearAllMocks();
    });
    describe("실패 케이스", () => {
      it("인증 실패 -> 401", async () => {
        //1️⃣ given
        req.user = undefined;
        //2️⃣ when
        await controller.modifyJoinStatus(req, res, next);
        //3️⃣ then
        expect(next).toHaveBeenCalledWith(
          expect.objectContaining({
            status: 401,
            message: "인증과 관련된 오류입니다.",
          })
        );
      });
      it("권한 없음 -> 403", async () => {
        //1️⃣ given
        req.user = {
          id: "ADMIN-1",
          role: "ADMIN",
        };
        //2️⃣ when
        await controller.modifyJoinStatus(req, res, next);
        expect(next).toHaveBeenCalledWith(
          expect.objectContaining({
            status: 403,
            message: "권한과 관련된 오류입니다.",
          })
        );
        //3️⃣ then
      });
      it("잘못된 요청 값입니다", async () => {
        //1️⃣ given
        req.user = {
          id: "ADMIN-1",
          role: "SUPER_ADMIN",
        };
        req.params = {};
        //2️⃣ when
        await controller.modifyJoinStatus(req, res, next);
        //3️⃣ then
        expect(next).toHaveBeenCalledWith(
          expect.objectContaining({
            status: 400,
            message: "잘못된 요청입니다.",
          })
        );
      });
      it("서비스로부터 서비스 값을 반환 실패 -> 500", async () => {
        //1️⃣ given
        req.user = {
          id: "ADMIN-1",
          role: "SUPER_ADMIN",
        };
        jest.spyOn(service, "modifyJoinStatus").mockImplementation(() => {
          throw new HttpError(500, "알 수 없는 에러 입니다.");
        });
        //2️⃣ when
        await controller.modifyJoinStatus(req, res, next);
        //3️⃣ then
        expect(next).toHaveBeenCalledWith(
          expect.objectContaining({
            status: 500,
            message: "알 수 없는 에러 입니다.",
          })
        );
      });
    });
    it("서비스로부터 서비스 값을 반환 성공 -> 204", async () => {
      //1️⃣ given
      req.user = {
        id: "ADMIN-1",
        role: "SUPER_ADMIN",
        joinStatus: "APPROVED",
      };
      jest
        .spyOn(service, "modifyJoinStatus")
        .mockImplementation(async (id, joinStatus) => {
          return {
            id,
            contact: "01011112222",
            name: "Hana",
            role: "ADMINS",
            avatar: null,
            isActive: true,
            joinStatus: req.user.joinStatus ?? "PENDING",
            approvedAt: null,
            adminOf: {
              id: "apt - 1",
              createdAt: new Date("2015-01-01"),
              updatedAt:new Date("2025-01-01"),
              name:"망미 주공 아파트",
              address:"부산 광역시",
              description:"안녕하세요. 망미 주공아파트 101동 입니다",
              officeNumber:"0511112222",
              buildingNumberFrom:104,
              buildingNumberTo:404,
              floorCountPerBuilding:4,
              unitCountPerFloor:4,
              adminId: id,
            },
          };
        });
      //2️⃣ when
      await controller.modifyJoinStatus(req, res, next);
      //3️⃣ then
    });
  });

  //=================================================================
  describe("관리자들 가입 상태 수정 컨트롤러", () => {
    //let service =
    beforeEach(() => {});
    describe("실패 케이스", () => {
      it.todo(
        "인증 실패 -> 401" // async () => {
        //1️⃣ given
        //2️⃣ when
        //3️⃣ then
        //}
        //
      );
      it.todo(
        "권한 없음 -> 403"
        //async () => {
        //1️⃣ given
        //2️⃣ when
        //3️⃣ then
        //}
      );
      it.todo(
        "서비스로부터 서비스 값을 반환 실패 -> 500"
        //async () => {
        //1️⃣ given
        //2️⃣ when
        //3️⃣ then
        //}
      );
    });
    it.todo(
      "서비스로부터 서비스 값을 반환 성공 -> 204"
      //async () => {
      //1️⃣ given
      //2️⃣ when
      //3️⃣ then
      //}
    );
  });

  //=================================================================
  describe("거절된 관리자 일괄 삭제 컨트럴러", () => {
    describe("실패 케이스", () => {
      it.todo(
        "인증 실패 -> 401"
        //async () => {
        //1️⃣ given
        //2️⃣ when
        //3️⃣ then
        //}
      );
      it.todo(
        "권한 없음 -> 403"
        //async () => {
        //1️⃣ given
        //2️⃣ when
        //3️⃣ then
        //}
      );
      it.todo(
        "서비스로부터 서비스 값을 반환 실패 -> 500"
        //async () => {
        //1️⃣ given
        //2️⃣ when
        //3️⃣ then
        //}
      );
    });
    it.todo(
      "서비스로부터 서비스 값을 반환 성공 -> 204"
      //async () => {
      //1️⃣ given
      //2️⃣ when
      //3️⃣ then
      //}
    );
  });
});
