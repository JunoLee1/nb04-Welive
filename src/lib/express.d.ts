import type { JoinStatus, User } from "../../prisma/generated/client.ts";

declare global {
    namespace Express {
        interface User {
            id: string;
            role: string;
            approvedAt: Date| null
            email:string;
            name:string;
            username:string;
            joinStatus:JoinStatus
        }
    }
}
