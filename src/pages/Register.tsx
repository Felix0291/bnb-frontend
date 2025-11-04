import { useState } from "react";
import authService from "../services/authService";
import { useNavigate } from "react-router-dom";

const Register = () => {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true);
        setError("")

        try {
            const response = await authService.registerUser(email, password, name);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.err || "Register faild")
            }

            console.log("User registrated", email)
            navigate("/login")
        } catch (err) {
            setError(err instanceof Error ? err.message : "Kunde inte registrera");
            console.error("Failed to register:", err);
        } finally {
            setLoading(false);
        }
    }

    return(
        <div >
            <div>
            <h2 className="fixed top-20 left-0 w-full text-3xl font-bold text-center" >Skapa ett konto</h2>
            </div>
            <form className="mt-8" onSubmit={handleRegister}>
                <div>
                <label htmlFor="email" className="sr-only">
                    Name
                    </label>
                <input
                    id= "name"
                    name= "name" 
                    type="name"
                    placeholder="Namn"
                    className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 bg-white rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                 />
                 </div>
                 <div>
                    <label htmlFor="email" className="sr-only">
                        email
                    </label>
                    <input
                        id="email"
                        type="email"
                        name= "email"
                        placeholder="Email"
                        className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 bg-white rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        />
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

                 {error && (
                    <div className="text-red-600 text-sm text-center">
                        {error}
                    </div>
                 )}

                 <button 
                    type="submit"
                    disabled={loading}
                    className='text-white'
                    >
                        {loading ? "registerar..." : "registrera"}
                    </button>
            </form>
        </div>

        
    )
}

export default Register;