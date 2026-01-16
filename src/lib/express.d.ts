import type { User } from "../../prisma/generated/client.js";

declare global {
    namespace Express {
        interface User {
            id: string;
            role: string;
            approvedAt: Date| null,
            avatar: File| undefined
            Multer: File | null
        }
    }
}
