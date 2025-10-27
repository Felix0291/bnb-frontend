class PropertyService {
    private baseUrl: string;
    private propertyUrl: string;

    constructor() {
        this.baseUrl = import.meta.env.VITE_BACKEND_BASE_URL || "http://localhost:3000";
        this.propertyUrl = `${this.baseUrl}/properties`;
    }

    private getAuthHeaders() {
        const token = localStorage.getItem("access_token");
        console.log("🔑 Token from localStorage:", token ? "Token exists" : "No token found");
        console.log("🔗 Backend URL:", this.propertyUrl);
        
        return {
            "Content-Type": "application/json",
            ...(token && { "Authorization": `Bearer ${token}` })
        };
    }

    //Hämta alla properties
    async getAllProperties() {
        const url = `${this.propertyUrl}`;
        const response = await fetch(url, {
            method: "GET",
            headers: this.getAuthHeaders(),
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error('Failed to fetch properties');
        }
        
        return response.json();
    }

    //Hämta ett specifikt property på id
    async getPropertiesById(id: string) {
        const url = `${this.propertyUrl}/${id}`;
        const response = await fetch(url, {
            method: "GET",
            headers: this.getAuthHeaders(),
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error("Faild to fetch property")
        }

        return response.json();
    }

    //Hämta alla properties på en användare (som användaren man är inloggad som har skapat (på mypage))
    async getPropertiesByUserId(userId: string) {
        const url = `${this.propertyUrl}?user_id=${userId}`     
        const response = await fetch(url, {
            method: "GET",
            headers: this.getAuthHeaders(),
            credentials: "include"
        })

        if (!response.ok) {
            throw new Error("Faild to fetch user properties")
        }
        
        const data = await response.json();
        return data;
    }

    //Skapa ett nytt property
   async createProperty(property: NewProperty) {
    const url = `${this.propertyUrl}`;
    const response = await fetch(url, {
        method: "POST",
        headers: this.getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify(property)
    })

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json()
    }

    //Uppdatera ett property
    async updateProperty(property: Property) {
        const url = `${this.propertyUrl}/${property.id}`
        const response = await fetch(url, {
            method: "PUT",
            headers: this.getAuthHeaders(),
            credentials: "include",
            body: JSON.stringify(property)
        })

        if (!response.ok) {
            throw new Error("Faild to update property")
        }
        return response.json()
    }
}
export default new PropertyService();