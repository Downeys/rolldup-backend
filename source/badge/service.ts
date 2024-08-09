import repo from './repo';

export interface Badge {
    label: string,
    level: string,
    awardedAt: Date,
}

const listBadgesForUser = async (userId: number): Promise<Array<Badge>> => {
    const rows = await repo.findBadgesByUserIdOrderByAwardedAtDesc(userId);
    return rows.map(record => {
        return {
            label: record["label"],
            level: record["level"],
            awardedAt: record["awarded_at"],
        };
    }).sort((left, right) => right.awardedAt - left.awardedAt);
};

export default {
    listBadgesForUser,
};
