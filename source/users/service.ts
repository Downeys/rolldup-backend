import { IUser, IUserView } from '../interfaces';
import userRepo from './repo';
import settingsRepo from '../user-settings/repo'
import endorsementsService from '../user-endorsements/service'

const NAMESPACE = 'user-service';

const constructUserViews = (users: IUser[]) => {
    let userViews: IUserView[] = [];
    users.forEach((user) => {
        userViews.push({
            id: user.user_id,
            username: user.username,
            rank: user.user_rank,
            profilePic: user.profile_pic,
            joinDate: user.join_date
        });
    });
    return userViews;
};

const constructSettingsObj = (settings: any) => ({
    profileSettings: {
        pronouns: settings.pronouns,
        birthdate: settings.birthdate,
        privacy: settings.public_profile ? 'public' : 'private'
    },
    displaySettings: {
        mode: settings.dark_mode ? 'dark' : 'light'
    },
    pushNotifications: {
        messages: settings.pn_messages,
        groupActivities: settings.pn_group_activities,
        comments: settings.pn_comments,
        friendRequests: settings.pn_friend_requests,
        recommendations: settings.pn_recommendations,
        newsletter: settings.pn_newsletter
    }
});

export const getUserByUserId = async (userId: number) => {
    let user = (await userRepo.getUserByUserId(userId)) as IUser[];
    if (user?.[0]) {
        const userView: IUserView[] = constructUserViews(user);
        return userView[0];
    }
    return {} as IUserView;
};

export const getUserWithSettingsByUserId = async (userId: number) => {
    let user = (await userRepo.getUserByUserId(userId)) as IUser[];
    if (user?.[0]) {
        const settings = (await settingsRepo.getSettingsByUserId(userId)) as any[];
        const userView: IUserView[] = constructUserViews(user);
        const endorsements = await endorsementsService.getEndorsementsByUserId(userId);
        return { ...userView[0], settings: constructSettingsObj(settings[0]), endorsements };
    }
    return {} as any;
};

export const createUserInDb = async (user: any) => {
    return await userRepo.createNewUser(user.username);
};

export default { createUserInDb, getUserByUserId, getUserWithSettingsByUserId }
