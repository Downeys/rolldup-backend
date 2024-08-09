export interface IUser {
    user_id: number;
    username: string;
    user_rank: string;
    profile_pic: string;
    join_date: Date;
}

export interface IUserView {
    id: number;
    username: string;
    rank: string;
    profilePic: string;
    joinDate: Date;
}

export interface ILog {
    lod_id: number;
    pic_url: string;
    user_id: number;
    time_logged: string;
    strain_id: number;
    rating: number;
    review?: string;
}

export interface IStrain {
    name: string;
    strain: number;
    category: string;
}
