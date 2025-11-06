
class AuthService {
    private baseUrl: string;
    private authUrl: string;
    private userUrl: string;

    constructor() {
        this.baseUrl = import.meta.env.VITE_BACKEND_BASE_URL || "http://localhost:3000";
        this.authUrl = `${this.baseUrl}/auth`
        this.userUrl = `${this.baseUrl}/users`
    }

    //Hämta autentiseringsh
    private getAuthHeaders() {
        const token = localStorage.getItem("access_token");
        return {
            "Content-Type": "application/json",
            ...(token && { "Authorization": `Bearer ${token}` })
        };
    }

    //Logga in en användare
    async login(email: string, password: string) {
        let url = `${this.authUrl}/login`
        return await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({email, password})
        })
    }

    //Registrera en ny användare
    async registerUser(email: string, password: string, name?: string) {
        let url = `${this.authUrl}/register`
        return await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({email, password, name})
        })
    }
    
    //Hämta en användare
    async getUser() {
        const token = localStorage.getItem("access_token");
        
        if (!token) {
            return null;
        }
        
        const url = `${this.userUrl}/me`  
        const response = await fetch(url, {
            method: "GET",
            credentials: "include",
            headers: this.getAuthHeaders() 
        })
        
        if (!response.ok) {
            if (response.status === 401) {
                return null 
            }
            const error = await response.json()
            throw new Error(error.message || 'Failed to get user')
        }
        return response.json()
    }
    async logout() {
        const url = `${this.authUrl}/logout`;
        return await fetch(url, {
            method: "POST",
            headers: this.getAuthHeaders(),
            credentials: "include"
        });
    }
}

export default new AuthService;


