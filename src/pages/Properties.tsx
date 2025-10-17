import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const Properties = () => {
    const [properties, setProperties] = useState<Property[]>([])

    useEffect(() => {
        const fetchProperties = async () => {
            const {data, error} = await supabase
            .from("properties")
            .select("*")

            if (error) {
                console.error("Error fetching properties", error)
            } else {
                setProperties(data || [])
            }
        }
        fetchProperties()
    }, [])

    return (
        <div>
            <h1 className=" left-0 w-full text-3xl font-bold text-center">Properties:</h1>
            <ul className="pt-24">
                {properties.map((property) => (
                    <li key={property.id} className="mb-4 p-4 border rounded">
                        <img src={property.imgUrl} alt={property.name} className="w-full h-48 object-cover rounded mb-2" />
                        <h3 className="font-bold">{property.name}</h3>
                        <p className="text-lg">{property.pricePerNight} kr/natt</p>
                    </li>
                ))} 
            </ul>
        </div>
    )
}

  
export default Properties;