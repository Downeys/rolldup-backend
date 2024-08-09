export interface PurchaseLocation {
    purchase_location_id: number;
    name: string;
    street1: string;
    street2: string;
    city: string;
    state_code: string;
    country_code: string;
    phone: string;
    email: string;
    url: string;
}

export interface PurchaseLocationView {
    purchaseLocationId: number;
    name: string;
    street1: string;
    street2: string;
    city: string;
    stateCode: string;
    countryCode: string;
    phone: string;
    email: string;
    url: string;
}