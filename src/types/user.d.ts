interface NewUser {
    user_id?: string;
    name: string;
    email: string;
    isAdmin?: boolean;
    role?: "user" | "admin" 
}

interface User extends NewUser {
    user_id: string;
}


declare global {
    interface User {
        user_id: string;
        name: string;
        email: string;
        isAdmin?: boolean;
        role?: "user" | "admin";
    }
}

type UserListQuery = {
    limit?: number;
    offset?: number;
    isAdmin?: boolean;
    q?: string;
    sort_by?: "name" | "email" | string;
}

