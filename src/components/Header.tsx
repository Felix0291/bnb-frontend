
import OpenHouseImg from "../assets/openHouseImg.png"
import { Link } from "react-router-dom";
import UserMenu from "./UserMenu";





const Header = () => {
    return (

        <div className="absolute top-0 left-0 right-0 w-full h-20 bg-lightblue text-black font-mono p-4 z-50 border-b-2 border-lightgrey flex items-center">
            <Link to="/">
            <img className="w-[80px] rounded-xl ml-4" src={OpenHouseImg} alt="" />
            </Link>
            <div className="mr-5">
                <UserMenu />
            </div>
        </div>
        
    );
};
export default Header;