
import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import useBookings from '../hooks/useBookings';
import useProperties from '../hooks/useProperties';
import BookingCard from '../components/BookingCard';
import PropertyCard from '../components/PropertyCard';
import PropertyForm from '../components/PropertyForm';
import EditBookingModal from '../components/EditBookingModal';
import propertyService from "../services/propertyService";

const MyPage = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    
    // Properties hook
    const { 
        properties, 
        loading: loadingProperties, 
        error: propertiesError, 
        createProperty, 
        updateProperty, 
        deleteProperty 
    } = useProperties(user?.id);
    
    // Bookings hook
    const { 
        bookings, 
        loadingBookings, 
        errorBookings, 
        updateBookingDates, 
        deleteBooking 
    } = useBookings(user?.id);
    
    // Property form state
    const [editingProperty, setEditingProperty] = useState<Property | null>(null);
    const [propertyMap, setPropertyMap] = useState<Record<string, Property>>({});
    
    // Booking modal state
    const [editingBooking, setEditingBooking] = useState<NewBooking | null>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [savingBooking, setSavingBooking] = useState(false);
    const [deletingBookingId, setDeletingBookingId] = useState<string | null>(null);
    const [deletingPropertyId, setDeletingPropertyId] = useState<string | null>(null);
    
    const formRef = useRef<HTMLDivElement>(null);

    // Load property map for bookings (to show property info in booking cards)
    useEffect(() => {
        const loadAllProps = async () => {
            try {
                const all = await propertyService.getAllProperties();
                const map: Record<string, Property> = {};
                all.forEach((p: Property) => { map[p.id] = p; });
                setPropertyMap(map);
            } catch (err) {
                console.error("Kunde inte hämta properties", err);
            }
        };
        loadAllProps();
    }, []);

    // Handle property form submit
    const handlePropertySubmit = async (newProperty: NewProperty) => {
        if (editingProperty) {
            await updateProperty({
                ...newProperty,
                id: editingProperty.id
            } as Property);
            setEditingProperty(null);
        } else {
            await createProperty(newProperty);
        }
    };

    // Handle property edit
    const handlePropertyEdit = (property: Property) => {
        setEditingProperty(property);
        setTimeout(() => {
            formRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }, 100);
    };

    // Handle property delete
    const handlePropertyDelete = async (propertyId: string, propertyName: string) => {
        if (!window.confirm(`Är du säker på att du vill ta bort "${propertyName}"? Det går inte att ångra`)) {
            return;
        }
        
        setDeletingPropertyId(propertyId);
        try {
            await deleteProperty(propertyId);
            if (editingProperty?.id === propertyId) {
                setEditingProperty(null);
            }
        } finally {
            setDeletingPropertyId(null);
        }
    };

    // Handle property form cancel
    const handlePropertyCancel = () => {
        setEditingProperty(null);
    };

    // Handle booking edit
    const handleBookingEdit = (booking: NewBooking) => {
        setEditingBooking(booking);
        setIsEditOpen(true);
    };

    // Handle booking delete
    const handleBookingDelete = async (id: string) => {
        if (!window.confirm("Är du säker på att du vill ta bort bokningen?")) return;
        setDeletingBookingId(id);
        try {
            await deleteBooking(id);
        } finally {
            setDeletingBookingId(null);
        }
    };

    // Handle booking save
    const handleBookingSave = async ({ checkIn, checkOut }: { checkIn: string; checkOut: string }) => {
        if (!editingBooking?.id) return;
        setSavingBooking(true);
        try {
            await updateBookingDates(editingBooking.id, checkIn, checkOut);
            setIsEditOpen(false);
            setEditingBooking(null);
        } catch (err) {
            console.error("Kunde inte uppdatera bokningen:", err);
        } finally {
            setSavingBooking(false);
        }
    };

    // Check authentication
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
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition mb-6"
            >
                Logga ut
            </button>

            {/* Error messages */}
            {(propertiesError || errorBookings) && (
                <div className="max-w-md mx-auto mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    {propertiesError || errorBookings}
                </div>
            )}

            {/* Properties Section */}
            {loadingProperties ? (
                <div className="text-center mb-8">
                    <p>Laddar dina properties...</p>
                </div>
            ) : properties.length > 0 ? (
                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">Mina Properties ({properties.length})</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                        {properties.map((property) => (
                            <PropertyCard
                                key={property.id || property.name}
                                property={property}
                                onEdit={handlePropertyEdit}
                                onDelete={handlePropertyDelete}
                                deleting={deletingPropertyId === property.id}
                                loading={loadingProperties}
                            />
                        ))}
                    </div>
                </div>
            ) : (
                <div className="text-center text-gray-500 mb-8">
                    <p>Du har inga properties än. Skapa en nedan!</p>
                </div>
            )}

            {/* Bookings Section */}
            {loadingBookings ? (
                <div className='text-center mb-8'>
                    <p>Laddar dina Bookings</p>
                </div>
            ) : bookings.length > 0 ? (
                <div className='mb-8'>
                    <h2 className='text-xl font-semibold mb-4'>Mina bokningar ({bookings.length})</h2>
                    <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3'>
                        {bookings.map((booking) => (
                            <BookingCard
                                key={booking.id}
                                booking={booking}
                                property={propertyMap[booking.property_id]}
                                deleting={deletingBookingId === booking.id}
                                onEdit={handleBookingEdit}
                                onDelete={handleBookingDelete}
                            />
                        ))}
                    </div>
                </div>
            ) : null}

            {/* Edit Booking Modal */}
            <EditBookingModal
                open={isEditOpen}
                booking={editingBooking}
                saving={savingBooking}
                onClose={() => { setIsEditOpen(false); setEditingBooking(null); }}
                onSave={handleBookingSave}
            />

            {/* Property Form */}
            <PropertyForm
                property={editingProperty}
                isEditMode={!!editingProperty}
                loading={loadingProperties}
                onSubmit={handlePropertySubmit}
                onCancel={handlePropertyCancel}
                formRef={formRef}
            />
        </div>
    );
};

export default MyPage;