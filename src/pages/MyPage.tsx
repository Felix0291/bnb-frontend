// src/pages/MyPage.tsx
import React, { useEffect, useRef, useState } from 'react';
import propertyService from "../services/propertyService";
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { IoReturnDownBack } from 'react-icons/io5';
import bookingService from '../services/bookingService';


const MyPage = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [pricePerNight, setPricePerNight] = useState("");
    const [availability, setAvailability] = useState(true);
    const [imgUrl, setImgUrl] = useState("");
    const [properties, setProperties] = useState<NewProperty[]>([])
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [propertyMap, setPropertyMap] = useState<Record<string, Property>>({})
    const [loadingProperties, setLoadingProperties] = useState(false);
    const [editingPropertyId, setEditingPropertyId] = useState<string | null>(null);
    const [bookings, setBookings] = useState<NewBooking[]>([]);
    const [loadingBookings, setLoadingBookings] = useState(false)
    const [editBooking, setEditBooking] = useState<string | null>(null); 
    const [isEditMode, setIsEditMode] = useState(false);
    const formRef = useRef<HTMLDivElement>(null)

    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserProperties = async () => {
            if (!user?.id) return;
            setLoadingProperties(true)
            try {
                const userProperties = await propertyService.getPropertiesByUserId(user.id);
                setProperties(userProperties)
            } catch (err) {
                console.error("Error fetch inge user properties", err)
                setError("Could not get your properties")
            } finally {
                setLoadingProperties(false);
            }
        }
        fetchUserProperties()
    }, [user?.id])

    // useEffect(() => {
    //     const loadAllProps = async () => {
    //         try {
    //             const all = await propertyService.getAllProperties()
    //             const map: Record<string, Property> = {};
    //             all.forEach((p: Property) => {map[p.id] = p; })
    //             setPropertyMap(map)
    //         } catch (err) {
    //             console.error("Kunde inte hämta properties", err)
    //         }
    //     }
    //     loadAllProps()

    // }, [])
    
    // useEffect(() => {
    //     const fetchUserBookings = async () => {
    //         if (!user?.id) return;
    //         setLoadingBookings(true);
    //         try {
    //             const allBookings = await bookingService.getBookingsByUserId(user.id);
    //             // Fallback if backend inte filtrerar:
    //             const onlyMine = Array.isArray(allBookings)
    //                 ? allBookings.filter(b => b.user_id === user.id)
    //                 : [];
    //             setBookings(onlyMine);
    //         } catch (err) {
    //             console.error("Error med att hämta bookings", err);
    //             setError("Kunde inte hämta bookings");
    //         } finally {
    //             setLoadingBookings(false);
    //         }
    //     };
    
    //     fetchUserBookings();
    // }, [user?.id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true);
        setError("");

        try {
            const newProperty: NewProperty = {
                name,
                description,
                location,
                pricePerNight: Number(pricePerNight),
                availability,
                imgUrl
            }

            if (isEditMode && editingPropertyId) {
                const updatedProperty = await propertyService.updateProperty({
                    ...newProperty,
                    id: editingPropertyId
                } as Property)

                setProperties(properties.map(p => 
                    p.id === editingPropertyId ? updatedProperty : p
                ));
                setIsEditMode(false);
                setEditingPropertyId(null)
            } else {
                const createdProperty = await propertyService.createProperty(newProperty)
                setProperties([...properties, createdProperty]);
            }

            setName("");
            setDescription("");
            setLocation("");
            setPricePerNight("");
            setAvailability(true);
            setImgUrl("");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Kunde inte skapa property");
            console.error("Error creating property:", err);
        } finally {
            setLoading(false);
        }
    }

    const handleDelete = async (propertyId: string, propertyName: string) => {
        if (!window.confirm(`Är du säker på att du vill ta bort "${propertyName}"? Det går inte att ångra`)) {
            
        }

        setLoading(true);
        setError("")

        try {
            await propertyService.deleteProperty(propertyId);
            setProperties(properties.filter(p => p.id !== propertyId));

            if (editingPropertyId === propertyId) {
                setIsEditMode(false);
                setEditingPropertyId(null);
                setName("");
                setDescription("");
                setLocation("");
                setPricePerNight("");
                setAvailability(true);
                setImgUrl("");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Kunde inte ta bort property")
        } finally {
            setLoading(false)
        }
    } 

    if (!isAuthenticated) {
        return (
            <div className="p-8">
                <h1 className="text-3xl font-bold text-center mb-8">Min sida</h1>
                <div className="max-w-md mx-auto bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
                    <p className="text-center">
                        Du måste vara inloggad för att skapa properties.
                        <br />
                        <a href="/login" className="text-blue-600 hover:text-blue-800 underline">
                            Logga in här
                        </a>
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-4">
                <h1>Min sida</h1>

            </div>
            <h3 className="text-start text-gray-600 mb-4">Välkommen: {user?.name}</h3>
            <button
                onClick={() => {
                    logout();
                    navigate("/");
                }}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
                Logga ut
            </button>

            {error && (
                <div className="max-w-md mx-auto mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}

            {loadingProperties ? (
                <div className="text-center mb-8">
                    <p>Laddar dina properties...</p>
                </div>

            ) : properties.length > 0 ? (
                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">Mina Properties ({properties.length})</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                        {properties.map((property) => (
                            <div key={property.id || property.name} className="bg-white p-3 rounded-lg shadow-md">
                                {property.imgUrl && (
                                    <img src={property.imgUrl} alt={property.name} className="w-full h-32 object-cover rounded mb-2" />
                                )}
                                <h3 className="font-bold text-base">{property.name}</h3>
                                <p className="text-gray-600 text-sm">{property.location}</p>
                                <p className="text-green-600 font-semibold text-sm">{property.pricePerNight} kr/natt</p>
                                <p className="text-xs text-gray-500 line-clamp-2">{property.description}</p>
                                <span className={`inline-block px-2 py-1 rounded text-xs mt-2 ${property.availability ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                    {property.availability ? 'Tillgänglig' : 'Inte tillgänglig'}
                                </span>
                                <button 
                                    onClick={() => {
                                        const p = property as Property;
                                        setEditingPropertyId(p.id);
                                        setName(p.name);
                                        setDescription(p.description || "");
                                        setLocation(p.location);
                                        setPricePerNight(p.pricePerNight.toString());
                                        setAvailability(p.availability || true);
                                        setImgUrl(p.imgUrl || "");
                                        setIsEditMode(true);

                                        setTimeout(() => {
                                            formRef.current?.scrollIntoView({
                                                behavior: "smooth",
                                                block: "start"
                                            })
                                        }, 100)
                                    }}
                                    className="mt-2 w-full px-3 py-1 text-white rounded hover:bg-black transition text-xs">
                                        Redigera
                                </button>
                                <button
                                    onClick={() => handleDelete(property.id!, property.name)}
                                    className="mt-2 w-full px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition text-xs"
                                    disabled={loading}
                                    >
                                        Ta bort
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

            ) : (
                <div className="text-center text-gray-500 mb-8">
                    <p>Du har inga properties än. Skapa en nedan!</p>
                </div>
            )}
            

            {/* {loadingBookings ? (
    <div className='text-center mb-8'>
        <p>Laddar dina Bookings</p>
    </div>
) : bookings.length > 0 ? (
    <div className='mb-8'>
        <h2 className='text-xl font-semibold mb-4'>Mina bokningar ({bookings.length})</h2>
        
        <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3'>
            {bookings.map((booking) => (
                <div key={booking.id} className="bg-white p-3 rounded-lg shadow-md">
                    <h3 className="font-bold text-base">Bokning</h3>
                    {propertyMap[booking.property_id]?.imgUrl && (
    <img
        src={propertyMap[booking.property_id].imgUrl!}
        alt={propertyMap[booking.property_id].name}
        className="w-full h-32 object-cover rounded mb-2"
    />
)}
<p className="font-semibold text-sm">
    {propertyMap[booking.property_id]?.name || "Laddar..."}
</p>
                    <p className="text-sm text-gray-600">Incheckning: {new Date(booking.check_in_date).toLocaleDateString()}</p>
                    <p className="text-sm text-gray-600">Utcheckning: {new Date(booking.check_out_date).toLocaleDateString()}</p>
                </div>
            ))}
            
        </div>
    </div>
) : null} */}

            <div ref={formRef} className="max-w-lg mx-auto bg-white p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">{isEditMode ? "Redigera egendom" : "Skapa ny egendom"}</h2>

                <form onSubmit={handleSubmit} className="m-8 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700"></label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 bg-white rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Namn"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700"></label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 bg-white rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Beskrivning"
                            rows={3}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700"></label>
                        <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 bg-white rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Plats"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700"></label>
                        <input
                            type="number"
                            value={pricePerNight}
                            onChange={(e) => setPricePerNight(e.target.value)}
                            className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 bg-white rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Pris per natt SEK"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700"></label>
                        <input
                            type="url"
                            value={imgUrl}
                            onChange={(e) => setImgUrl(e.target.value)}
                            placeholder="Bild URL"
                            className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 bg-white rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        />
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            checked={availability}
                            onChange={(e) => setAvailability(e.target.checked)}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-900">
                            Tillgänglig
                        </label>
                    </div>

                        {isEditMode && (
                            <button
                                type='button'
                                onClick={() => {
                                    setIsEditMode(false);
                                    setEditingPropertyId(null);
                                    setName("");
                                    setDescription("");
                                    setLocation("");
                                    setPricePerNight("");
                                    setAvailability(true);
                                    setImgUrl("");
                                }}
                                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 mb-2"
                                >
                                    Avbryt redigering
                            </button>
                        )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                        {loading ? (isEditMode ? "Skapar..." : "Skapar") : (isEditMode ? "Sparar ändringar" : "Skapa Egendom")}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default MyPage;