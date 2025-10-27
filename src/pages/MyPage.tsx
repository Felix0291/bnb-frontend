// src/pages/MyPage.tsx
import React, { useEffect, useState } from 'react';
import propertyService from '../services/PropertyService';
import { useAuth } from '../context/AuthContext';

const MyPage = () => {  
    const { user, isAuthenticated } = useAuth();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [pricePerNight, setPricePerNight] = useState("");
    const [availability, setAvailability] = useState(true);
    const [imgUrl, setImgUrl] = useState("");
    const [properties, setProperties] = useState<NewProperty[]>([])
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [loadingProperties, setLoadingProperties] = useState(false);

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
    },[user?.id])

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

            console.log(" Creating property:", newProperty);
            console.log(" Current token:", localStorage.getItem("access_token"));

            const createdProperty = await propertyService.createProperty(newProperty);
            
            setProperties([...properties, createdProperty]);

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

    return(
        <div className="p-8">
            <h1>Min sida</h1>
            <p className="text-center text-gray-600 mb-4">Inloggad som: {user?.email}</p>
            
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {properties.map((property) => (
                            <div key={property.id || property.name} className="bg-white p-4 rounded-lg shadow-md">
                                {property.imgUrl && (
                                    <img src={property.imgUrl} alt={property.name} className="w-full h-48 object-cover rounded mb-2" />
                                )}
                                <h3 className="font-bold text-lg">{property.name}</h3>
                                <p className="text-gray-600">{property.location}</p>
                                <p className="text-green-600 font-semibold">{property.pricePerNight} kr/natt</p>
                                <p className="text-sm text-gray-500">{property.description}</p>
                                <span className={`inline-block px-2 py-1 rounded text-xs mt-2 ${
                                    property.availability ? 'bg-green-100 textTurkish-800' : 'bg-redviz-100 text-red-800'
                                }`}>
                                    {property.availability ? 'Tillgänglig' : 'Inte tillgänglig'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="text-center text-gray-500 mb-8">
                    <p>Du har inga properties än. Skapa en nedan!</p>
                </div>
            )}

            <div className="max-w-lg mx-auto bg-white p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Skapa ny egendom</h2>
                
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
                    
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                        {loading ? "Skapar..." : "Skapa Property"}
                    </button>
                </form>
            </div>

            

            {/* Visa skapade properties */}
            {properties.length > 0 && (
                <div className="mt-8">
                    <h2 className="text-xl font-semibold mb-4">Mina Properties ({properties.length})</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {properties.map((property, index) => (
                            <div key={index} className="bg-white p-4 rounded-lg shadow-md">
                                {property.imgUrl && (
                                    <img src={property.imgUrl} alt={property.name} className="w-full h-48 object-cover rounded mb-2" />
                                )}
                                <h3 className="font-bold text-lg">{property.name}</h3>
                                <p className="text-gray-600">{property.location}</p>
                                <p className="text-green-600 font-semibold">{property.pricePerNight} kr/natt</p>
                                <p className="text-sm text-gray-500">{property.description}</p>
                                <span className={`inline-block px-2 py-1 rounded text-xs ${
                                    property.availability ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                    {property.availability ? 'Tillgänglig' : 'Inte tillgänglig'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default MyPage;