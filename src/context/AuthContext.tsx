
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import authService from "../services/authService";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    adminLogin: (email: string, password: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
    isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        initializeAuth()
    }, [])

    const initializeAuth = async () => {
        try {
            const userData = await authService.getUser();
            setUser(userData?.user || null) 
        } catch (err) {
            setUser(null)
        } finally {
            setLoading(false)
        }
    }

    const login = async (email: string, password: string) => {
        try {
            const response = await authService.login(email, password)

            if(!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to login")
            }

            const data = await response.json();

            if (data.access_token) {
                localStorage.setItem("access_token", data.access_token)
            }
            if (data.refresh_token) {
                localStorage.setItem("refresh_token", data.refresh_token)
            }
            if (data.expires_at) {
                localStorage.setItem("expires_at", data.expires_at.toString())
            }
            if (data.admin_token) {
                localStorage.setItem("admin_token", data.admin_token)
            }

            const userData = await authService.getUser()
            setUser(userData?.user || null) 
        } catch (err) {
            throw err;
        }
    }

    const adminLogin = async (email: string, password: string) => {
        try {
            const response = await authService.adminLogin(email, password);

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || "Failed to login as admin")
            }

            const data = await response.json();
      
            // Spara tokens
            if (data.access_token) {
              localStorage.setItem('access_token', data.access_token);
            }
            if (data.refresh_token) {
              localStorage.setItem('refresh_token', data.refresh_token);
            }
            if (data.expires_at) {
              localStorage.setItem('expires_at', data.expires_at.toString());
            }
            if (data.admin_token) {
              localStorage.setItem('admin_token', data.admin_token);
            }

            const userData = await authService.getUser()
            setUser(userData?.user || null)
        } catch (err) {
            throw err
        }
    }

    const logout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token")
        localStorage.removeItem("expires_at");
        localStorage.removeItem("admin_token")
        setUser(null)
    }
    
    const value: AuthContextType = {
        user,
        loading, 
        login,
        adminLogin,
        logout,
        isAuthenticated: !!user,
        isAdmin: !!localStorage.getItem("admin_token")
    }

    return(
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}