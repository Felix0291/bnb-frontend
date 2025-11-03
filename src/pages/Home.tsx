
import { useState, useEffect } from "react";
import propertyService from "../services/propertyService";
import { Link } from "react-router-dom";
import descriptionText from "../assets/description.txt?raw";

interface Property {
    id: string;
    name: string;
    description?: string;
    location: string;
    pricePerNight: number;
    availability?: boolean;
    imgUrl?: string;
    user_id?: string;
    listing_agent_id?: string;
    created_at?: string;
    updated_at?: string;
}

const Home = () => {
    const [properties, setProperties] = useState<Property[]>([]);

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const data = await propertyService.getAllProperties();
                setProperties(data);
            } catch (error) {
                console.error("Error fetching properties", error);
            }
        };
        fetchProperties();
    }, []);

    return (
        
        <div className="pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-12">
            <div className="space-y-6">
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                    Upptäck världen med openHouse
                </h1>
                <p className="text-lg text-gray-600 leading-relaxed">
                    Vi erbjuder det du behöver för att njuta av din semester med familjen, tid att skapa minnesvärda stunder tillsammans.
                </p>
               
            </div>
            <div className="flex justify-end">
                <img 
                    src="https://interiordesign.net/wp-content/uploads/2024/12/Interior-Design-Westchester-Home-Amy-Courtney-Design-RockledgeDrive-29C.jpg"  
                    className="w-full max-w-lg h-80 object-cover rounded-3xl shadow-lg" 
                    alt="Beautiful home"
                />
                
            </div >
    </div>
    <div className="border-b border-gray-300 mb-12"></div>

            
           
            <div className="pt-10 mx-auto px-4 sm:px-6 lg:px-8 ">
                <div className="grid grid-cols-5 gap-10">
                    {properties.map((property) => (
                        <Link key={property.id} to={`/propertydetails/${property.id}`}>
                            <div className="mb-4 p-4 border-black rounded-lg">
                                <img src={property.imgUrl} alt={property.name} className="w-rounded-lg h-48 object-cover rounded mb-2" />
                                <h3 className="font-bold">{property.name}</h3>
                                <p className="text-xs text-gray-500">{property.pricePerNight} kr/natt</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;