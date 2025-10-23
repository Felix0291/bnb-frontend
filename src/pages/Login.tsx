
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { login, adminLogin } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("")

        try {
            if (isAdmin) {
                await adminLogin(email, password);
            } else {
                await login(email, password);
            }
            navigate("/mypage")
        } catch (err) {
            setError(err instanceof Error ? err.message : "Login failed")
        } finally {
            setLoading(false)
        }
    }
     return(
        <div className="flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Logga in:
                    </h2>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm  space-y-1 ">
                        <div>
                            <label htmlFor="email" className="sr-only">
                                Email
                            </label>
                            <input 
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 bg-white rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" 
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}/>
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">
                                Password
                            </label>
                            <input 
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password" 
                                required
                                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 bg-white rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>
                    
                    {/* Admin checkbox */}
                    <div className="flex items-center">
                        <input
                            id="isAdmin"
                            name="isAdmin"
                            type="checkbox"
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            checked={isAdmin}
                            onChange={(e) => setIsAdmin(e.target.checked)}
                        />
                        <label htmlFor="isAdmin" className="ml-2 block text-sm text-gray-900">
                            Logga in som admin
                        </label>
                    </div>

                    {error && (
                        <div className="text-red-600 text-sm text-center">
                           {error} 
                        </div>
                    )}
                    <div>
                        <button
                        type="submit"
                        disabled={loading}
                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "...." : "Logga in"}
                        </button>
                    </div>
                    <div className="text-center">
                        <p className="text-sm text-gray-600">
                            Har du ett konto?{""}
                            <a href="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                            Registrera dig här:
                            </a>
                        </p>
                    </div>
                </form>

            </div>
        </div>
    )
}

export default Login;