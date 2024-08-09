export interface Brand {
    brand_id: number;
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

export interface BrandView {
    id: number;
    name: string;
    street: string;
    street2: string;
    city: string;
    stateCode: string;
    countryCode: string;
    phone: string;
    email: string;
    url: string;
}

export interface NewBrandView {
    name: string;
    street: string;
    street2: string;
    city: string;
    stateCode: string;
    countryCode: string;
    phone: string;
    email: string;
    url: string;
}