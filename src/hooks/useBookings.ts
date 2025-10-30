import { useEffect, useState } from "react"
import bookingService from "../services/bookingService";

const useBooking = (userId?: string) => {
    const [bookings, setBookings] = useState<NewBooking[]>([]);
    const [loadingBookings, setLoadingBookings] = useState(false);
    const [errorBookings, setErrorBookings] = useState<string>("");

    useEffect(() => {
        const fetchUserBookings = async () => {
            if (!userId) return;
            setLoadingBookings(true);
            setErrorBookings("");
            try {
                const all = await bookingService.getBookingsByUserId(userId);
                const onlyMine = Array.isArray(all) ? all.filter((b: NewBooking) => b.user_id === userId) : [];
                setBookings(onlyMine)
            } catch (err) {
                setErrorBookings(err instanceof Error ? err.message: "Kunde inte hämta bookings")
            } finally {
                setLoadingBookings(false)
            }
        }
        fetchUserBookings();

    }, [userId])

    const updateBookingDates = async (id: string, checkIn: string, checkOut: string) => {
        const original = bookings.find(b => b.id === id);
        if (!original) throw new Error("Kunde inte hitta bokningen")
            const payload: Booking = {
        ...(original as Booking),
        id,
        check_in_date: checkIn,
        check_out_date: checkOut,
        updated_at: new Date().toISOString()
    }
    const saved = await bookingService.updateBooking(payload);
    setBookings(prev => 
        prev.map(b => (b.id === id ? { ...b, check_in_date: saved.check_in_date, check_out_date: saved.check_out_date } : b))
    );
    }

    const deleteBooking = async (id: string) => {
        await bookingService.deleteBooking(id);
        setBookings(prev => prev.filter(b => b.id !== id))
    }
    return{bookings, loadingBookings, errorBookings, updateBookingDates, deleteBooking}
}

export default useBooking;