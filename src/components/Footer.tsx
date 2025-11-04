
import OpenHouseImg from "../assets/openHouseImg.png";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="w-screen h-20 bg-gray-200 text-black font-mono p-4 flex items-center -ml-[50vw] left-1/2 relative mt-8">
            <div className="w-full max-w-screen-2xl mx-auto flex items-center">
                <Link to="/">
                    <img className="w-[80px] rounded-xl ml-4" src={OpenHouseImg} alt="" />
                </Link>
                
                <div className="ml-auto mr-5">
                    <p className="text-s font-bold">© 2025 Open House, Inc. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;


    