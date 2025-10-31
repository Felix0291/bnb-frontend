import { useEffect, useState } from "react"
import propertyService from "../services/propertyService";

const useProperties = (userId?: string) => {
    const [properties, setProperties] = useState<NewProperty[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>("");

    //Hämtar property
    useEffect(() => {
        const fetchUserProperties = async () => {
            if (!userId) return;
            setLoading(true);
            setError("")
            try {
                const userProperties = await propertyService.getPropertiesByUserId(userId);
                setProperties(userProperties)
            } catch (err) {
                setError(err instanceof Error ? err.message: "Kunde inte hämta dinna egendommar")
                console.error("Errror fetching user properties", err)
            } finally {
                setLoading(false)
            }
        }
        fetchUserProperties();
    }, [userId])

    //Skapar en property
    const createProperty = async (property: NewProperty) => {
        setLoading(true);
        setError("");
        try {
            const createdProperty = await propertyService.createProperty(property);
            setProperties(prev => [...prev, createdProperty]);
            return createdProperty
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Kunde inte skapa egendom";
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false)
        }
    };

    //Uppdaterar property
    const updateProperty = async (property: Property) => {
        setLoading(true);
        setError("")
        try {
            const updatedProperty = await propertyService.updateProperty(property);
            setProperties(prev => prev.map(p => (p.id === property.id ? updatedProperty : p)));
            return updatedProperty;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Kunde inte uppdatera egendom"
            setError(errorMessage)
            throw err;
        }  finally {
            setLoading(false);
        }
    };

    //Tar bort en property
    const deleteProperty = async (propertyId: string) => {
        setLoading(true);
        setError("")
        try {
            await propertyService.deleteProperty(propertyId);
            setProperties(prev => prev.filter(p => p.id !== propertyId));
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Kunde inte ta bort egendom"
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false)
        }
    };

    return {
        properties,
        loading,
        error,
        createProperty,
        updateProperty,
        deleteProperty,
    };
};

export default useProperties;