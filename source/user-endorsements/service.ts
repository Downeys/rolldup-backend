import repo from './repo';
import userService from '../users/service'

const NAMESPACE = 'user-endorsements-service';

const constructEndorsementView = (endsorsement: any) => ({ eula: endsorsement.eula, adult: endsorsement.adult, firstLogin: endsorsement.first_login })

export const endorseFirstLogin = async (userId: number) => {
    return await repo.endorseFirstLogin(userId);
}

export const endorseEulaAndAge = async (userId: number) => {
    await repo.endorseAgeAndEula(userId);
    return await userService.getUserWithSettingsByUserId(userId);
}

export const endorseEula = async (userId: number) => {
    return await repo.endorseEula(userId);
}

export const getEndorsementsByUserId = async (userId: number) => {
    const endorsements = await repo.getEndorsementsByUserId(userId) as any[];
    return endorsements?.length > 0 ? constructEndorsementView(endorsements[0]) : { eula: false, adult: false, firstLogin: true };
};

export default { endorseEulaAndAge, endorseEula, endorseFirstLogin, getEndorsementsByUserId }