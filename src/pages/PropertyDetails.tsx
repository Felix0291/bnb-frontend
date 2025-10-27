import { useEffect, useState } from 'react';
import PropertyService from '../services/PropertyService';
import { useParams } from 'react-router-dom';

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

const PropertyDetails = () => {
    const {id} = useParams<{id: string}>()
    const [propertyById, setPropertyById] = useState<Property | null>(null)

    useEffect(() => {
        const fetchProperties = async () => {
            if(!id) return;
            try {
                const data = await PropertyService.getPropertiesById(id);
                setPropertyById(data);
            } catch (error) {
                console.error("Failed to fetch prperties", error)
            }
        }
        fetchProperties();
    },[id])
     
    return(
        <div>
        <h1 className="fixed top-20 left-0 w-full text-3xl font-bold text-center" >Propertydetails:</h1>
        <div>
            {propertyById && (
                
                <div className="bg-green-50" key={propertyById.id}>
                    <div>
                    <img className="w-96 h-auto" src={propertyById.imgUrl} alt={propertyById.name} />
                    
                </div>
                <div className=''>
                <h2>{propertyById.name}</h2>
                <p>{propertyById.location}</p>
                <p>{propertyById.description}</p>
                <p>{propertyById.pricePerNight}</p>
                <button className='text-white'>Boka nu!</button>
            </div>
            </div>
                
            )}
        </div>
        
        </div>
    )
}

export default PropertyDetails;