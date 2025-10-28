
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { ImManWoman } from "react-icons/im";


const UserMenu = () => {
    const { isAuthenticated, user} = useAuth();

        if (isAuthenticated) {
            return(
                <Link to="/mypage"
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-200 rounded transition">
                
                    <span>Mina sidor</span>
                </Link>
            )
        }

    return(
        <Link
        to="/login"
        className="px-4 py-2 bg-darkblue text-white rounded hover:bg-blue-600 transition">
            Logga in
        </Link>
    )
}

export default UserMenu;