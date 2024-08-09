import repo from './repo';
import contentService from '../content/service'

const NAMESPACE = 'user-settings-service';

export const updateNotificationsSvc = async (body: any) => {
    return repo.updatePushNotis(body);
};

export const updatePrivacySvc = async (body: any) => {
    const publicProfile = body.publicProfile;
    const userId = body.callingUser.userId;
    return await repo.updateProfilePrivacy(userId, publicProfile);
};

export const updateBirthdateSvc = async (body: any) => {
    const birthdate = body.birthdate;
    const userId = body.callingUser.userId;
    return await repo.updateUserBirthdate(userId, birthdate);
};

export const updatePronounsSvc = async (body: any) => {
    const pronouns = body.pronouns;
    const userId = body.callingUser.userId;
    return await repo.updateUserPronouns(userId, pronouns);
};

export const updateUsernameSvc = async (body: any) => {
    const newUsername = body.newUsername;
    const userId = body.callingUser.userId;
    return await repo.updateUsername(userId, newUsername);
};

export const updateProfilePicSvc = async (body: any, image: any) => {
    let imageUrl = await contentService.uploadProfilePic(image);
    await repo.updateProfilePic(body.callingUser.userId, imageUrl);
    return imageUrl;
};