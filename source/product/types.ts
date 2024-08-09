export interface Product {
    product_id: number;
    name: string;
    category: string;
    brand_id: number;
    purchase_location_id: number;
}

export interface ProductView {
    id: number;
    name: string;
    category: string;
    brandId: number;
    purchaseLocationId: number;
}

export interface NewProductView {
    name: string;
    category: string;
    brandId: number;
    purchaseLocationId: number;
}
