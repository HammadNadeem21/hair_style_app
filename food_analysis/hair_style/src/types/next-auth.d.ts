import "next-auth";

declare module "next-auth" {
    interface User {
        credits?: number;
        id?: string;
    }

    interface Session {
        user: User;
    }
}
