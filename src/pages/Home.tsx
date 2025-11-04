
import { useState, useEffect } from "react";
import propertyService from "../services/propertyService";
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
                    src="https://s3-us-west-2.amazonaws.com/amplify-sustainable9/images/Projects/Minikahda-Residence/_1200x630_crop_center-center_82_none/3774-Zenith-Ave-52.jpg?mtime=1682522013"  
                    className="w-full max-w-lg h-80 object-cover rounded-3xl shadow-lg" 
                    alt="Beautiful home"
                />
                
            </div >
    </div>
    <div className="border-b border-gray-300 mb-12"></div>

            
           
            <div className="pt-10 mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Populära boenden
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {properties.slice(0, 10).map((property) => (
                        <Link 
                            key={property.id} 
                            to={`/propertydetails/${property.id}`}
                        >
                            <div className="bg-white rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
                                
                                <div className="relative">
                                    <img 
                                        src={property.imgUrl || 'https://via.placeholder.com/400x300'} 
                                        alt={property.name} 
                                        className="w-full aspect-square object-cover rounded-t-xl" 
                                    />
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold text-gray-900 mb-1 truncate">
                                        {property.name}
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-2">
                                        {property.location}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1">
                                            <svg className="w-4 h-4 fill-current text-black" viewBox="0 0 20 20">
                                                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                                            </svg>
                                        </div>
                                        <p className="text-sm font-semibold text-gray-900">
                                            {property.pricePerNight} kr <span className="font-normal text-gray-600">/natt</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
                
               
                {properties.length > 10 && (
                    <div className="mt-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                            Fler boenden
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {properties.slice(10).map((property) => (
                                <Link 
                                    key={property.id} 
                                    to={`/propertydetails/${property.id}`}
                                >
                                    <div className="bg-white rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
                                        
                                        <div className="relative">
                                            <img 
                                                src={property.imgUrl || 'https://via.placeholder.com/400x300'} 
                                                alt={property.name} 
                                                className="w-full aspect-square object-cover rounded-t-xl" 
                                            />
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-semibold text-gray-900 mb-1 truncate">
                                                {property.name}
                                            </h3>
                                            <p className="text-sm text-gray-600 mb-2">
                                                {property.location}
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-1">
                                                    <svg className="w-4 h-4 fill-current text-black" viewBox="0 0 20 20">
                                                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                                                    </svg>
                                                </div>
                                                <p className="text-sm font-semibold text-gray-900">
                                                    {property.pricePerNight} kr <span className="font-normal text-gray-600">/natt</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
              
            </div>
        </div>
    );
};

export default Home;