import { useState } from "react";
import OpenHouseImg from "../assets/openHouseImg.png"
import { TfiAlignJustify } from "react-icons/tfi";
import { Link } from "react-router-dom";





const Header = () => {
    const [loggedIn, setLoggedIn] = useState(false)
    return (

        <div className="absolute top-0 left-0 right-0 w-full h-20 bg-lightblue text-black font-mono p-4 z-50 border-b-2 border-lightgrey flex items-center">
            <Link to = "/">
            <img className="w-[80px] rounded-xl ml-4" src={OpenHouseImg} alt="" />
            </Link>
        </div>
        
    );
};
export default Header;