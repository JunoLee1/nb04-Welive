declare namespace Express {
    interface Request {
        user?: {
            id: string;
            username: string;
            password: string;
            email: string;
            avatar: string;
            isActive: boolean;
            role: string;
            contact: string;
            adminOf?: {
                id: string;
                name: string;
            },
        };
    }
}