import type React from "react";

type BookingCardProps = {
    booking: NewBooking;
    property?: Property;
    onEdit: (booking: NewBooking) => void;
    onDelete: (id: string) => void;
    deleting?: boolean;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking, property, onEdit, onDelete, deleting }) => {
    return (
        <div className="bg-white p-3 rounded-lg">
            <h3 className="font-bold text-base">Bokning</h3>
            {property?.imgUrl && (
                <img src={property.imgUrl} alt={property.name} className="w-full h-32 object-cover rounded mb-2" />
            )}
            <p className="font-semibold text-sm">{property?.name || "Laddar.."}</p>
            <p className="text-sm text-black">Incheckning: {new Date(booking.check_in_date).toLocaleDateString()}</p>
            <p className="text-sm text-black">Utcheckning: {new Date(booking.check_out_date).toLocaleDateString()}</p>

            <div className="mt-3 grid grid-cols-2 gap-2">
                <button onClick={() => onEdit(booking)} className="px-3 py-1 bg-black text-white rounded text-sm">
                    Ändra datum
                </button>
                <button
                    onClick={() => onDelete(booking.id!)}
                    disabled={deleting}
                    className="text-white"
                >
                    {deleting ? "Tar bort.." : "Ta bort"}
                </button>

            </div>
        </div>
    )
}
export default BookingCard;