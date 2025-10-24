import { useState } from "react";
import { TfiAlignJustify } from "react-icons/tfi";




const Header = () => {
    const [showMenu, setShowMenu] = useState(false);

    const toggleMenu = () => {
        setShowMenu(prev => !prev);
    };
    return (
        <div className="absolute top-0 left-0 right-0 w-full h-12 bg-lightblue text-black font-mono p-4 z-50 border-b-2 border-black flex items-center justify-center">
            
            <h3 className="text-black font-mono bg-transparent flex-shrink-0">Oppendoors BNB</h3>
            
            </div>
    );
};
export default Header;