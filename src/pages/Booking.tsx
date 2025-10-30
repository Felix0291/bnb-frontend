import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import propertyService from "../services/propertyService";
import bookingService from '../services/bookingService';



const Booking = () => {
    const { isAuthenticated, user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const propertyId = location.state?.propertyId || new URLSearchParams(location.search).get("propertyId");

    const [property, setProperty] = useState<Property | null>(null);
    const [checkIn, setCheckIn] = useState<string>("");
    const [checkOut, setCheckOut] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [availability, setAvailability] = useState(true);
    const [error, setError] = useState("")


    useEffect(() => {
        if (!propertyId) {
            navigate("/");
            return;
        }

        const fetchProperty = async () => {
            try {
                const data = await propertyService.getPropertiesById(propertyId);
                setProperty(data);
            } catch (err) {
                console.error("Faild to fetch property", err)
            } 
        }

        fetchProperty();
    }, [propertyId, navigate]);

    const handleBooking = async () => {
        if (!checkIn || !checkOut || !propertyId || !user?.id) {
            setError("Välj datum för att fortsätta!");
        }

        setLoading(true);
        setError("")

        try {
            const newBooking: NewBooking = {
                property_id: propertyId,
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

    if (!isAuthenticated) {
        return (
            <div className='fixed top-20 left-0 w-full p-8'>
                <div className='max-w-4xl mx-auto text-center'>
                    <p className='text-lg mb-4'>Du måste vara inloggad för att boka</p>
                    <button
                        onClick={() => navigate("/login")}
                        className="px-6 py-2 bg-indigo-600 text-white rounded"
                        >
                            Logga in
                        </button>
                </div>
            </div>
        )
    }

    if (!property) {
        return (
            <div className='fixed top-20 left-0 w-full p-8'>
                <p className='text-center'>Laddar...</p>
            </div>
        )
    }

    const nights = checkIn && checkOut
        ? Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))
        : 0;
    const total = nights * property.pricePerNight;

    const formatDateRange = () => {
        if (!checkIn || !checkOut) return "Välj datum";

        const startDate = new Date(checkIn);
        const endDate = new Date(checkOut);

        const startDay = startDate.getDate();
        const startMonth = startDate.toLocaleDateString("sv-SE", {month: "short"});
        const endDay = endDate.getDate();
        const endMonth = endDate.toLocaleDateString("sv-SE", {month: "short"});
        const year = endDate.getFullYear();

        if (startMonth === endMonth) {
            return `${startDay}-${endDay} ${startMonth} ${year}`;
        }
        return `${startDate.toLocaleDateString('sv-SE', { day: 'numeric', month: 'short' })} - ${endDate.toLocaleDateString('sv-SE', { day: 'numeric', month: 'short', year: 'numeric' })}`;
    }

    const isDateSelected = checkIn && checkOut && nights > 0;

    return(
        <div className='fixed top-20 left-0 w-full min-h-screen bg-gray-50 p-8'>
            <div className='max-w-4xl mx-auto'>
                <h1 className='text-2xl font-bold mb-6'>Bekräfta din bokning</h1>

                <div className='bg-white rounded-lg shadow-sm p-6 max-w-md'>
                    <div className='flex gap-4 mb-6'>
                        {property.imgUrl && (
                            <img 
                            src={property.imgUrl} 
                            alt="" 
                            className='w-24 h-24 object-cover rounded-lg'/>
                        )}
                        <div className='flex-1'>
                            <h3 className='font-semibold'>{property.name}</h3>
                            <p className='text-sm text-gray-600'>{property.location}</p>
                            <p className='text-sm text-gray-600'>{property.pricePerNight} SEK / Kväll</p>
                        </div>
                    </div>

                    <div className='mb-4 pb-4 border-b'>
                        <div className='flex justify-between items-center mb-2'>
                            <span className='font-medium text-sm'>Datum</span>
                            <button className='text-xs text-white'>Ändra</button>
                        </div>
                    </div>

                    <div className='space-y-2'>
                        <div className='flex justify-between text-sm'>
                            <span>
                                {nights > 0 ? (
                                    <>{nights} {nights === 1 ? 'natt' : 'nätter'} × {property.pricePerNight.toLocaleString('sv-SE')} kr</>
                                ) : (
                                    <span className='text-gray-500'>Välj datum för att se pris</span>
                                )}
                            </span>
                            {nights > 0 && (
                                <span>{total.toLocaleString('sv-SE')} kr</span>
                            )}
                        </div>
                        
                        {nights > 0 && (
                            <div className='border-t pt-3 flex justify-between font-semibold'>
                                <span>Totalt</span>
                                <span>{total.toLocaleString('sv-SE')} kr SEK</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className='mt-6 bg-white rounded-lg p-6 max-w-md'>
                    <h2 className='font-semibold mb-4'>Välj datum</h2>
                    <div className='space-y-4'>
                        <div>
                            <label className='block text-sm font-medium mb-1'>Incheckning</label>
                            <input 
                                type="date"
                                value={checkIn}
                                onChange={(e) => setCheckIn(e.target.value)}
                                min={new Date().toISOString().split("T")[0]}
                                className='bg-white w-full px-3 py-2 border rounded-lg' />
                        </div>
                        <div>
                            <label className='block text-sm font-medium mb-1'></label>
                            <input 
                            type="date"
                            value={checkOut}
                            onChange={(e) => setCheckOut(e.target.value)}
                            min={new Date().toISOString().split("T")[0]}
                            className='bg-white w-full px-3 py-2 border rounded-lg'
                             />
                        </div>
                    </div>
                    </div>
                    
                    {error && (
                        <div className='mt-4 text-red-600 text-sm max-w-md'>
                            {error}
                        </div>
                    )}

                    {isDateSelected && (
                        <button
                            onClick={handleBooking}
                            disabled={loading}
                            className='mt-6 w-full py-3 bg-black text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold'
                            >
                                {loading ? "Bokar..." : "Boka hotel"}
                        </button>
                    )}
                </div>
        </div>
    )

   

}

export default Booking;