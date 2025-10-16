interface NewUser {
    user_id?: string;
    name: string;
    email: string;
    isAdmin?: boolean;
}

interface User extends NewUser {
    user_id: string;
}

type UserListQuery = {
    limit?: number;
    offset?: number;
    isAdmin?: boolean;
    q?: string;
    sort_by?: "name" | "email" | string;
}

