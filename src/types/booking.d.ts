interface NewBooking {
    id?: string;
    created_at: string;
    check_in_date: string;
    check_out_date: string;

    //Realations

    user_id?: string; // Optional since we get it from auth
    property_id: string;
}

interface Booking extends NewBooking {
    id: string;
    created_at: string;
    updated_at: string;
}

type BookingListQuery = {
    price?: string;
    availability?: string;
    q?:string
    sort_by?: string
}
