// import { useEffect, useState } from 'react';
// import PropertyService from '../services/PropertyService';
// import { Link, useParams } from 'react-router-dom';

// interface Property {
//     id: string;
//     name: string;
//     description?: string;
//     location: string;
//     pricePerNight: number;
//     availability?: boolean;
//     imgUrl?: string;
//     user_id?: string;
//     listing_agent_id?: string;
//     created_at?: string;
//     updated_at?: string;
// }

// const PropertyDetails = () => {
//     const { id } = useParams<{ id: string }>()
//     const [propertyById, setPropertyById] = useState<Property | null>(null)

//     useEffect(() => {
//         const fetchProperties = async () => {
//             if (!id) return;
//             try {
//                 const data = await PropertyService.getPropertiesById(id);
//                 setPropertyById(data);
//             } catch (error) {
//                 console.error("Failed to fetch prperties", error)
//             }
//         }
//         fetchProperties();
//     }, [id])

//     return (
//         <div>
//             {/* <h1 className="fixed top-20 left-0 w-full text-3xl font-bold text-center" >Propertydetails:</h1> */}

//             <div>

//                 {propertyById && (

//                     <div className=" w-full" key={propertyById.id}>

//                         <div>
//                             <h2 className='-ml-[1px] flex-1 space y-4 mt-10 text-left text-xl font-bold'>{propertyById.name}</h2>
//                             <img className="w-[900px] rounded-xl" src={propertyById.imgUrl} alt={propertyById.name} />
//                         </div>

//                         <div className=' -ml-[1px] flex-1 space y-4 mt-10 text-left'>
//                             <h2 className='text-xl font-bold'>{propertyById.location}</h2>
//                             <p>{propertyById.description}</p>
//                             <p className="">{propertyById.pricePerNight} SEK / Kväll</p>
//                         </div>

//                         <Link to="/booking" state={{ propertyId: propertyById.id }}>
//                             <button className='ml-[600px] -mt-[200px] text-white'>Boka nu!</button>
//                         </Link>

//                     </div>

//                 )}
//             </div>

//         </div>
//     )
// }

// export default PropertyDetails;

import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import PropertyService from '../services/PropertyService';
import bookingService from '../services/bookingService';

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
    const { id } = useParams<{ id: string }>()
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();
    
    const [propertyById, setPropertyById] = useState<Property | null>(null)
    const [checkIn, setCheckIn] = useState<string>("");
    const [checkOut, setCheckOut] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProperties = async () => {
            if (!id) return;
            try {
                const data = await PropertyService.getPropertiesById(id);
                setPropertyById(data);
            } catch (error) {
                console.error("Failed to fetch properties", error)
            }
        }
        fetchProperties();
    }, [id])

    const handleBooking = async () => {
        if (!checkIn || !checkOut || !id || !user?.id) {
            setError("Välj datum för att fortsätta!");
            return;
        }

        if (!isAuthenticated) {
            navigate("/login");
            return;
        }

        setLoading(true);
        setError("")

        try {
            const newBooking: NewBooking = {
                property_id: id,
                user_id: user?.id,
                check_in_date: checkIn,
                check_out_date: checkOut,
                created_at: new Date().toISOString()
            }

            await bookingService.createBooking(newBooking)
            navigate("/mypage", {state: {bookingSuccess: true}})
        } catch (err) {
            const msg = err instanceof Error ? err.message : "Kunde inte skapa bokning";
            setError(msg.toLowerCase().includes("inte tillgängligt") || msg.toLowerCase().includes("not available")
                ? "Boendet är inte tillgängligt för dessa datum."
                : msg);
        } finally {
            setLoading(false);
        }
    }

    const nights = checkIn && checkOut
        ? Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))
        : 0;
    const total = nights * (propertyById?.pricePerNight || 0);
    const isDateSelected = checkIn && checkOut && nights > 0;

    if (!propertyById) {
        return (
            <div className='fixed top-20 left-0 w-full p-8'>
                <p className='text-center'>Laddar...</p>
            </div>
        )
    }

    return (
        <div className='fixed top-20 left-0 w-full min-h-screen bg-gray-50'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                    {/* Vänster kolumn - Property Details */}
                    <div className='space-y-6'>
                        <div>
                            <h1 className='text-3xl font-bold mb-2'>{propertyById.name}</h1>
                            <p className='text-lg text-gray-600'>{propertyById.location}</p>
                        </div>

                        {propertyById.imgUrl && (
                            <img 
                                className="w-full h-[500px] object-cover rounded-xl shadow-lg" 
                                src={propertyById.imgUrl} 
                                alt={propertyById.name} 
                            />
                        )}

                        <div className='bg-white rounded-xl shadow-sm p-6'>
                            <h2 className='text-xl font-bold mb-4'>Om boendet</h2>
                            <p className='text-gray-700 leading-relaxed'>{propertyById.description || 'Ingen beskrivning tillgänglig.'}</p>
                        </div>

                        <div className='bg-white rounded-xl shadow-sm p-6'>
                            <h2 className='text-xl font-bold mb-4'>Prisinformation</h2>
                            <p className='text-2xl font-semibold'>{propertyById.pricePerNight.toLocaleString('sv-SE')} SEK / Kväll</p>
                        </div>
                    </div>

                    {/* Höger kolumn - Booking Form */}
                    <div className='lg:sticky lg:top-24 lg:h-fit'>
                        <div className='bg-white rounded-xl shadow-lg p-6'>
                            <h2 className='text-2xl font-bold mb-6'>Boka ditt boende</h2>

                            <div className='space-y-4 mb-6'>
                                <div>
                                    <label className='block text-sm font-medium mb-2'>Incheckning</label>
                                    <input 
                                        type="date"
                                        value={checkIn}
                                        onChange={(e) => setCheckIn(e.target.value)}
                                        min={new Date().toISOString().split("T")[0]}
                                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent' 
                                    />
                                </div>
                                <div>
                                    <label className='block text-sm font-medium mb-2'>Utcheckning</label>
                                    <input 
                                        type="date"
                                        value={checkOut}
                                        onChange={(e) => setCheckOut(e.target.value)}
                                        min={checkIn || new Date().toISOString().split("T")[0]}
                                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent'
                                    />
                                </div>
                            </div>

                            {isDateSelected && (
                                <div className='border-t border-gray-200 pt-4 mb-6'>
                                    <div className='space-y-3'>
                                        <div className='flex justify-between text-sm'>
                                            <span className='text-gray-600'>
                                                {nights} {nights === 1 ? 'natt' : 'nätter'} × {propertyById.pricePerNight.toLocaleString('sv-SE')} kr
                                            </span>
                                            <span className='font-medium'>{total.toLocaleString('sv-SE')} kr</span>
                                        </div>
                                        <div className='flex justify-between text-lg font-bold pt-3 border-t border-gray-200'>
                                            <span>Totalt</span>
                                            <span>{total.toLocaleString('sv-SE')} kr</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {error && (
                                <div className='mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm'>
                                    {error}
                                </div>
                            )}

                            {!isAuthenticated ? (
                                <button
                                    onClick={() => navigate("/login")}
                                    className='w-full py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition'
                                >
                                    Logga in för att boka
                                </button>
                            ) : (
                                <button
                                    onClick={handleBooking}
                                    disabled={loading || !isDateSelected}
                                    className='w-full py-3 bg-black text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold hover:bg-gray-800'
                                >
                                    {loading ? "Bokar..." : "Bekräfta bokning"}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PropertyDetails;