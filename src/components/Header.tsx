import { useState } from "react";
import OpenHouseImg from "../assets/openHouseImg.png"
import { TfiAlignJustify } from "react-icons/tfi";




const Header = () => {
    // const [showMenu, setShowMenu] = useState(false);

    // const toggleMenu = () => {
    //     setShowMenu(prev => !prev);
    // };
    return (
        
        <div className="absolute top-0 left-0 right-0 w-full h-20 bg-lightblue text-black font-mono p-4 z-50 border-b-2 border-lightgrey flex items-center">
    <img className="w-[80px] rounded-xl ml-4" src={OpenHouseImg} alt="" />   
    
</div>
    );
};
export default Header;