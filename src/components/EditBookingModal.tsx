import { useEffect, useState } from "react";

type editBookingModalProps = {
    open: boolean;
    booking: NewBooking | null;
    onClose: () => void;
    onSave: (dates: {checkIn: string, checkOut: string}) => Promise<void> | void;
    saving?: boolean;
}

const EditBookingModal: React.FC<editBookingModalProps> = ({open, booking, onClose, onSave, saving}) => {
    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("")

    useEffect(() => {
        if (booking) {
            setCheckIn(booking.check_in_date.slice(0, 10))
            setCheckIn(booking.check_out_date.slice(0,10))
        } else {
            setCheckIn("")
            setCheckOut("")
        }
    }, [booking])

    if (!open) return null;

    const today = new Date().toISOString().split("T")[0];
    
    return(
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-sm">
                <h2 className="font-semibold mb-4">Ändra datum</h2>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Incheckning</label>
                        <input 
                            type="date" 
                            value={checkIn}
                            onChange={(e) => setCheckIn(e.target.value)}
                            min={today}
                            className="bg-white w-full px-3 py-2 boder rounded-lg"  
                            />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Utcheckning</label>
                        <input 
                            type="date"
                            value={checkOut}
                            onChange={(e) => setCheckOut(e.target.value)}
                            min={today}
                            className="bg-white w-full px-3 py-2 border rounded-lg"
                         />
                    </div>
                </div>
                <div className="mt-5 grid grid-cols-2 gap-2">
                    <button
                        onClick={() => onSave({checkIn, checkOut})}
                        disabled={saving}
                        className="px-3 py-2 bg-green-600 text-white rounded-lg disabled:opacity-50"
                    >
                        {saving ? "saprar..." : "Spara"}
                    </button>
                    <button onClick={onClose} className="px-3 py-2 bg-gray-200 rounded-lg">
                        Avbryt
                    </button>

                </div>
            </div>

        </div>
    )
}

export default EditBookingModal;