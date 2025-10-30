class BookingService {
    private baseUrl: string;
    private bookingUrl: string;

    constructor() {
        this.baseUrl = import.meta.env.VITE_BACKEND_BASE_URL || "http://localhost:3000";
        this.bookingUrl = `${this.baseUrl}/bookings`;
    }
    private getAuthHeaders() {
        const token = localStorage.getItem("access_token");
        console.log("🔑 Token from localStorage:", token ? "Token exists" : "No token found");
        console.log("🔗 Backend URL:", this.bookingUrl);
        
        return {
            "Content-Type": "application/json",
            ...(token && { "Authorization": `Bearer ${token}` })
        };
    }

    async getAllBookings() {
        const url = `${this.bookingUrl}`;
        const response = await fetch(url, {
            method: "GET",
            headers: this.getAuthHeaders(),
            credentials: "include"
        })

        if (!response.ok) {
            throw new Error("Failed to fetch bookings")
        }

        return response.json()
    }

    async getBookingById(id: string) {
        const url = `${this.bookingUrl}/${id}`
        const response = await fetch(url, {
            method: "GET",
            headers: this.getAuthHeaders(),
            credentials: "include"
        })

        if (!response.ok) {
            throw new Error("Faild to fetch booking")
        }

        return response.json()
    }

    async getBookingsByUserId(userId: string) {
        const url = `${this.bookingUrl}?user_id=${userId}`
        const response = await fetch(url, {
            method: "GET",
            headers: this.getAuthHeaders(),
            credentials: "include"
        })

        if (!response.ok) {
            throw new Error("Faild to fetch user bookings")
        }

        const data = await response.json()
        return data;
    }

    async createBooking(booking: NewBooking) {
        const url = `${this.bookingUrl}`;
        const response = await fetch(url, {
            method: "POST",
            headers: this.getAuthHeaders(),
            credentials: "include",
            body: JSON.stringify(booking)
        })

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const status = response.status;
            const backendMessage = errorData?.message;
            let message = backendMessage || `HTTP error! status: ${status}`;
            if (status === 409) message = "Boendet är inte tillgängligt.";
            throw new Error(message);
        }
        return response.json()
    }

    async updateBooking(booking: Booking) {
        const url = `${this.bookingUrl}/${booking.id}`
        const response = await fetch(url, {
            method: "PATCH",
            headers: this.getAuthHeaders(),
            credentials: "include",
            body: JSON.stringify(booking)
        })

        if (!response.ok) {
            throw new Error("Failed to update booking")
        }
        return response.json()
    }

    async deleteBooking(id: string) {
        const url = `${this.bookingUrl}/${id}`;
        const response = await fetch(url, {
            method: "DELETE",
            headers: this.getAuthHeaders(),
            credentials: "include",
        });
    
        if (!response.ok) {
            throw new Error("Failed to delete booking");
        }
    
        if (response.status === 204) return null;
    
        try {
            return await response.json();
        } catch {
            return null;
        }
    }

}

export default new BookingService();