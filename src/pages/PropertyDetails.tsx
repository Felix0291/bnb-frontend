import { useEffect, useState } from 'react';
import PropertyService from '../services/PropertyService';
import { Link, useParams } from 'react-router-dom';


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
        {/* <h1 className="fixed top-20 left-0 w-full text-3xl font-bold text-center" >Propertydetails:</h1> */}
        
        <div>
            
            {propertyById && (
                
                <div className=" w-full" key={propertyById.id}>
                    
                    <div>
                    <h2 className='-ml-[1px] flex-1 space y-4 mt-10 text-left text-xl font-bold'>{propertyById.name}</h2>
                    <img className="w-[900px] rounded-xl" src={propertyById.imgUrl} alt={propertyById.name} />  
                </div>
                
                <div className=' -ml-[1px] flex-1 space y-4 mt-10 text-left'>
                <h2 className='text-xl font-bold'>{propertyById.location}</h2>
                <p>{propertyById.description}</p>
                <p className="">{propertyById.pricePerNight} SEK / Kväll</p>
            </div>
            
            <Link to={"/booking"}>
            <button className='ml-[600px] -mt-[200px] text-white'>Boka nu!</button>
            </Link>
            
            </div>
                
            )}
        </div>
        
        </div>
    )
}

export default PropertyDetails;