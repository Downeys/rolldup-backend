export interface DetailedLogRecord {
    strain_log_id: number;
    rating: number;
    review: string;
    pic_url: string;
    user_id: number;
    strain_id: number;
    cannabinoid: string;
    percentage: number;
    mgs: number;
    time_logged: string;
    category: string;
    strain: string;
    strain_name: string;
    brand_id: number;
    brand_name: string;
    product_id: number;
    product_name: string;
    purchase_location_id: number;
    purchase_location_name: string;
    comment_count: number;
    favorite_count: number;
}

interface Strain {
    id: number;
    name: string;
    category: string;
    strain: string;
}

interface Brand {
    id: number;
    name: string;
}

interface Product {
    id: number;
    name: string;
}

interface PurchaseLocation {
    id: number;
    name: string;
}

interface LogOwner {
    username: string;
    rank: string;
    profilePic: string;
}

interface CommentOwner {
    id: number;
    username: string;
}

export interface CommentView {
    id: number;
    message: string;
    owner: CommentOwner;
}

export interface DetailedLogView {
    id: number;
    rating: number;
    review: string;
    pictureUrl: string;
    owner: LogOwner;
    strain: Strain;
    brand: Brand;
    product: Product;
    purchaseLocation: PurchaseLocation;
    cannabinoid: string;
    percentage: number;
    mgs: number;
    timeLogged: string;
    comments: CommentView[];
    commentCount: number;
    favoriteCount: number;
    isFavorite: boolean;
    isBookmarked: boolean;
}