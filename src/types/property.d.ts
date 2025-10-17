interface NewProperty {
    id?: string;
    name: string;
    description?: string;
    location: string;
    pricePerNight: number;
    availability?: boolean;
    imgUrl?: string;
    //relationer
    user_id?: string;
    listing_agent_id?: string;
    //
    created_at?: string;
    updated_at?: string;
}

interface Property extends NewProperty {
    id: string;
    created_at?: string;
    updated_at?: string;
}

type PropertyListQuery = {
    limit?: number;
    offset?: number;
    availability?: string;
    q?: string;
    sort_by?: "name" | "location" | string;
}