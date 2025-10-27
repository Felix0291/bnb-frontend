
import { useState, useEffect } from "react";
import propertyService from "../services/PropertyService";
import { Link } from "react-router-dom";

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
        <div>
            <h2 className="left-0 w-full text-xl pt-20 font-bold text-center ">Boende uthyrning:</h2>
            <div className="pt-10">
                <Link to="/propertydetails">
                <div className="grid grid-cols-4  grid-rows-5 gap-4">
                    {properties.map((property) => (
                        <div
                            key={property.id} 
                            className="mb-4 p-4 border-black rounded shadow"
                        >
                            <img src={property.imgUrl} alt={property.name} className="w-full h-48 object-cover rounded mb-2" />
                            <h3 className="font-bold">{property.name}</h3>
                            <p className="text-lg">{property.pricePerNight} kr/natt</p>
                        </div>
                    ))}
                </div>
                </Link>
            </div>
        </div>
    );
};

export default Home;