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
}
export default new PropertyService();