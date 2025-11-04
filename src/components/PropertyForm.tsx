import React, {  useEffect, useState } from "react";

type PropertyFormProps = {
    property?: Property | null;
    isEditMode: boolean;
    loading: boolean;
    onSubmit: (property: NewProperty) => Promise<void>
    onCancel?: () => void;
    formRef?: React.RefObject<HTMLDivElement | null>;
}

const PropertyForm = ({
    property,
    isEditMode,
    loading,
    onSubmit,
    onCancel,
    formRef
}: PropertyFormProps) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [pricePerNight, setPricePerNight] = useState("");
    const [availability, setAvailability] = useState(true);
    const [imgUrl, setImgUrl] = useState("")

    useEffect(() => {
        if(property) {
            setName(property.name)
            setDescription(property.description || "")
            setLocation(property.location)
            setPricePerNight(property.pricePerNight.toString())
            setAvailability(property.availability ?? true)
            setImgUrl(property.imgUrl || "")
        } else {
            setName("")
            setDescription("")
            setLocation("")
            setPricePerNight("")
            setAvailability(true)
            setImgUrl("")
        }
    }, [property])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const NewProperty: NewProperty = {
            name,
            description,
            location,
            pricePerNight: Number(pricePerNight),
            availability,
            imgUrl
        }
        await onSubmit(NewProperty)

        if (!isEditMode) {
            setName("");
            setDescription("");
            setLocation("");
            setPricePerNight("")
            setAvailability(true);
            setImgUrl("")
            
        }
    };

    const handleCancle = () => {
        if (onCancel) {
            onCancel()
        }

        setName("")
        setDescription("")
        setLocation("")
        setPricePerNight("")
        setAvailability(true)
        setImgUrl("")
    };

    return (
        <div ref={formRef} className="max-w-lg mx-auto bg-white p-6 rounded-sm shadow-md">
            <h2 className="text-l font-semibold mb-4">
                {isEditMode? "Redigera egnendom" : "Skapa ny egendom"}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <input 
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)} 
                        className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 bg-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        placeholder="Namn"
                        required
                        />
                </div>
                <div>   
                    <textarea 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                         className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 bg-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                         placeholder="Beskrivning"
                         rows={4}
                    >
                    </textarea>
                </div>
                <div>
                    <input 
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                     className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 bg-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Plats"
                    required 
                    />
                </div>

                <div>
                    <input 
                        type="number"
                        value={pricePerNight}
                        onChange={(e) => setPricePerNight(e.target.value)}
                        className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 bg-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        placeholder="Pris per natt (SEK)"
                        required 
                        />
                </div>
                <div>
                    <input 
                        type="url"
                        value={imgUrl}
                        onChange={(e) => setImgUrl(e.target.value)}
                        placeholder="Bild URL"
                        className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 bg-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"     
                     />
                </div>
                <div>
                    <input 
                        type="checkbox"
                        checked={availability} 
                        onChange={(e) => setAvailability(e.target.checked)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">
                        Tillgänglig
                    </label>

                    {isEditMode && onCancel && (
                        <button
                            type="button"
                            onClick={handleCancle}
                            className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 mb-2"
                            >
                                Avbryt
                        </button>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-500 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                        >
                             {loading
                        ? isEditMode
                            ? "Sparar..."
                            : "Skapar..."
                        : isEditMode
                        ? "Sparar ändringar"
                        : "Skapa Egendom"}

                    </button>
                </div>
            </form>
        </div>
    )
 };

 export default PropertyForm;