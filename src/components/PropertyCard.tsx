import React from "react";

type PropertyCardProps = {
    property: Property | NewProperty;
    onEdit: (property: Property) => void;
    onDelete: (propertyId: string, propertyName: string) => void;
    deleting?: boolean;
    loading?: boolean;
};

const PropertyCard: React.FC<PropertyCardProps> = ({
    property,
    onEdit,
    onDelete,
    deleting = false,
    loading = false
}) => {
    const propertyId = property.id!;
    const propertyName = property.name;

    return (
        <div className="bg-white p-3 rounded-lg shadow-sm">
            {property.imgUrl && (
                <img 
                    src={property.imgUrl}
                    alt={property.name}
                    className="w.full h-32 object-cover rounded-mb-2
                "/>
            )}
            <h3 className="font-bold text-base">{property.name}</h3>
            <p className="text-gray-400 text-sm">{property.location}</p>
            <p className="text-gray-400 font-semibold text-sm ">
                {property.pricePerNight} kr/natt
            </p>
            <p className="text-xs text-gray-300 line-clamp-2">{property.description}</p>
            <span
                className={`inline-block px-2 py-1 rounded text-xs mt-2 ${
                    property.availability
                        ? "bg bg-green-100 text-green-300"
                        : "bg-red-100 text-red-300"}`}
                >
                    {property.availability ? "Tillgänglig" : "Inte tillgänglig"}             
            </span>
                <button
                onClick={() => onEdit(property as Property)}
                    className="mt-2 w-full px-3 py-1 text-white rounded bg-black transition text-xs"
                    >
                        Redigera
                </button>
                <button
                    onClick={() => onDelete(propertyId, propertyName)}
                    className="mt-2 w-full px-3 py-1 bg-red-600 text-white rounded transition text-xs"
                    disabled={loading || deleting}
                >
                    {deleting ? "Tar bort..." : "Ta bort"}
                </button>
        </div>
    );
};

export default PropertyCard;