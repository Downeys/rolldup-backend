import logging from '../config/logging';
import { IStrain } from '../interfaces';
import cursorUtils from '../utils/cursor-utils';
import repo from './repo';
import { DetailedLogRecord, DetailedLogView } from './types';

const NAMESPACE = 'log-feed-service';

export const getAllLogs = async (cursor: string, limit: number = 10) => {
    logging.info(NAMESPACE, 'Getting all logs');
    return await repo.getAllStrainLogs(cursor, limit) as Record<string, unknown>[];
};

export const getLogsByRating = async (cursor: string, limit: number = 10) => {
    logging.info(NAMESPACE, 'Getting logs by rating');
    return await repo.getLogsByRating(cursor, limit) as Record<string, unknown>[];
};

export const getLogsByCommentCount = async (cursor: string, limit: number = 10) => {
    logging.info(NAMESPACE, 'Getting logs by rating');
    return await repo.getLogsByCommentCount(cursor, limit) as Record<string, unknown>[];
};

export const getLogsByFavoriteCount = async (cursor: string, limit: number = 10) => {
    logging.info(NAMESPACE, 'Getting logs by rating');
    return await repo.getLogsByFavoriteCount(cursor, limit) as Record<string, unknown>[];
};

export const getFavoritesByUserId = async (userId: number) => {
    logging.info(NAMESPACE, 'Getting favorites by userId');
    const response = ((await repo.getFavoritesByUserId(userId)) as any[]) || [];
    return response.map((rec) => rec.log_id);
};

export const getBookmarksByUserId = async (userId: number) => {
    logging.info(NAMESPACE, 'Getting bookmarks by userId');
    const response = ((await repo.getBookmarksByUserId(userId)) as any[]) || [];
    return response.map((rec) => rec.log_id);
};

export const getLogsByUserId = async (userId: number) => {
    logging.info(NAMESPACE, 'Getting logs by username');
    return await repo.getStrainLogsByUserId(userId);
};

export const getLogList = async (logIds: any[]) => {
    logging.info(NAMESPACE, 'Getting favorited logs');
    let favoriteLogs: any[] = [];
    for (let i = 0; i <= logIds.length - 1; i++) {
        const resp = (await repo.getStrainLogByLogId(logIds[i])) as any[];
        favoriteLogs.push(resp[0]);
    }
    return favoriteLogs;
};

export const getUserByUserId = async (userId: number) => {
    logging.info(NAMESPACE, 'Getting user by id');
    return await repo.getUserByUserId(userId);
};

export const getCommentsByLogId = async (id: number) => {
    logging.info(NAMESPACE, 'Getting comments by id');
    return await repo.getCommentsByLogId(id);
};

const constructCommentViews = async (comments: any[]) => {
    logging.info(NAMESPACE, 'Constructing comment views');
    let commentViews: any[] = [];
    for (let i = 0; i < comments.length; i++) {
        try {
            const owner: any = await getUserByUserId(comments[i].owner_id);
            commentViews.push({
                id: comments[i].strain_log_comment_id,
                owner: {
                    id: owner[0].user_id,
                    username: owner[0].username
                },
                message: comments[i].comment_message
            });
        } catch (err: any) {
            logging.error(NAMESPACE, err.message, err);
        }
    }
    return commentViews;
};

const constructLogView = async (log: DetailedLogRecord, favorites: number[] = [], bookmarks: number[] = []) => {
    const owner: any = await getUserByUserId(log.user_id);
    const comments: any[] = (await getCommentsByLogId(log.strain_log_id)) as any[];
    const commentViews = await constructCommentViews(comments);
    const logView: DetailedLogView = {
        id: log.strain_log_id,
        pictureUrl: log.pic_url,
        review: log.review,
        rating: log.rating,
        cannabinoid: log.cannabinoid,
        percentage: log.percentage,
        timeLogged: log.time_logged,
        mgs: log.mgs,
        owner: {
            username: owner[0].username,
            rank: owner[0].user_rank,
            profilePic: owner[0].profile_pic,
        },
        strain: {
            id: log.strain_id,
            name: log.strain_name,
            category: log.category,
            strain: log.strain
        },
        brand: {
            id: log.brand_id,
            name: log.brand_name
        },
        product: {
            id: log.product_id,
            name: log.product_name
        },
        purchaseLocation: {
            id: log.purchase_location_id,
            name: log.purchase_location_name
        },
        comments: commentViews || [],
        commentCount: log.comment_count,
        favoriteCount: log.favorite_count,
        isFavorite: favorites.includes(log.strain_log_id),
        isBookmarked: bookmarks.includes(log.strain_log_id)
    }
    return logView;
}

const constructLogViews = async (logs: any[], favorites: number[], bookmarks: number[]) => {
    logging.info(NAMESPACE, 'Cronstructing log views');
    let logViews: any[] = [];
    for (let i = 0; i < logs.length; i++) {
        try {
            const logView = await constructLogView(logs[i], favorites, bookmarks);
            logViews.push(logView);
        } catch (err: any) {
            logging.error(NAMESPACE, err.message, err);
        }
    }
    return logViews;
};

export const getStrainLogByLogId = async (userId: number, logId: number) => {
    const log = await repo.getStrainLogByLogId(logId) as any[];
    if (log[0].user_id !== userId) {
        throw new Error("Not allowed")
    }
    const logView = await constructLogView(log[0])
    return logView;
}

export const getAllLogViews = async (userId: number, cursor: string, limit: number = 10) => {
    logging.info(NAMESPACE, 'Getting all logs');
    const logs = await getAllLogs(cursor, limit);
    let favorites: any[] = [];
    let bookmarks: any[] = [];
    if (userId !== -1) {
        favorites = (await repo.getFavoritesByUserId(userId) as any[]).map(favorite => favorite.log_id);
        bookmarks = (await repo.getBookmarksByUserId(userId) as any[]).map(bookmark => bookmark.log_id);
    }
    const newCursor = await cursorUtils.constructCursor(logs, "time_logged", "strain_log_id");
    const feed = await constructLogViews(logs as any[], favorites, bookmarks);
    return { feed, cursor: newCursor }
};

export const getLogViewsByStrainName = async (strainName: string, userId: number, cursor: string, limit: number = 10) => {
    logging.info(NAMESPACE, 'Getting all logs');

    const strainResults = await repo.getStrainByName(strainName) as any[];

    const logs = await repo.getLogsByStrainId(strainResults.map(strain => strain.strain_id), cursor, limit) as any[];
    let favorites: any[] = [];
    let bookmarks: any[] = [];
    if (userId !== -1) {
        favorites = (await repo.getFavoritesByUserId(userId) as any[]).map(favorite => favorite.log_id);
        bookmarks = (await repo.getBookmarksByUserId(userId) as any[]).map(bookmark => bookmark.log_id);
    }
    const newCursor = await cursorUtils.constructCursor(logs, "time_logged", "strain_log_id");
    const feed = await constructLogViews(logs as any[], favorites, bookmarks);
    return { feed, cursor: newCursor }
};

export const getHighestRatedFeed = async (userId: number, cursor: string, limit: number) => {
    logging.info(NAMESPACE, 'Getting highest rating feed');
    const logs = await getLogsByRating(cursor, limit);
    let favorites: any[] = [];
    let bookmarks: any[] = [];
    if (userId !== -1) {
        favorites = (await repo.getFavoritesByUserId(userId) as any[]).map(favorite => favorite.log_id);
        bookmarks = (await repo.getBookmarksByUserId(userId) as any[]).map(bookmark => bookmark.log_id);
    }
    const newCursor = await cursorUtils.constructCursor(logs, "rating", "time_logged");
    const feed = await constructLogViews(logs as any[], favorites, bookmarks);
    return { feed, cursor: newCursor }
};

export const getMostCommentedFeed = async (userId: number, cursor: string, limit: number) => {
    logging.info(NAMESPACE, 'Getting most commented feed');
    const logs = await getLogsByCommentCount(cursor, limit);
    let favorites: any[] = [];
    let bookmarks: any[] = [];
    if (userId !== -1) {
        favorites = (await repo.getFavoritesByUserId(userId) as any[]).map(favorite => favorite.log_id);
        bookmarks = (await repo.getBookmarksByUserId(userId) as any[]).map(bookmark => bookmark.log_id);
    }
    const newCursor = await cursorUtils.constructCursor(logs, "comment_count", "strain_log_id");
    const feed = await constructLogViews(logs as any[], favorites, bookmarks);
    return { feed, cursor: newCursor }
};

export const getMostFavoritedFeed = async (userId: number, cursor: string, limit: number) => {
    logging.info(NAMESPACE, 'Getting most commented feed');
    const logs = await getLogsByFavoriteCount(cursor, limit);
    let favorites: any[] = [];
    let bookmarks: any[] = [];
    if (userId !== -1) {
        favorites = (await repo.getFavoritesByUserId(userId) as any[]).map(favorite => favorite.log_id);
        bookmarks = (await repo.getBookmarksByUserId(userId) as any[]).map(bookmark => bookmark.log_id);
    }
    const newCursor = await cursorUtils.constructCursor(logs, "favorite_count", "strain_log_id");
    const feed = await constructLogViews(logs as any[], favorites, bookmarks);
    return { feed, cursor: newCursor }
};

export const getLogViewsByUsername = async (userId: number) => {
    logging.info(NAMESPACE, 'Getting logs by username');
    const logs: any = await getLogsByUserId(userId);
    let favorites: any[] = [];
    let bookmarks: any[] = [];
    if (userId !== -1) {
        favorites = (await repo.getFavoritesByUserId(userId) as any[]).map(favorite => favorite.log_id);
        bookmarks = (await repo.getBookmarksByUserId(userId) as any[]).map(bookmark => bookmark.log_id);
    }
    let favLogs: any[] = [];
    let bmedLogs: any[] = [];
    if (favorites.length > 0) favLogs = await getLogList(favorites);
    if (bookmarks.length > 0) bmedLogs = await getLogList(bookmarks);
    const personalLogs = await constructLogViews(logs, favorites, bookmarks);
    const favoriteLogs = await constructLogViews(favLogs, favorites, bookmarks);
    const bookmarkedLogs = await constructLogViews(bmedLogs, favorites, bookmarks);
    return { personalLogs, favoriteLogs, bookmarkedLogs };
};


export default {
    getAllLogViews,
    getLogViewsByUsername,
    getHighestRatedFeed,
    getMostCommentedFeed,
    getMostFavoritedFeed,
    getLogViewsByStrainName,
    getStrainLogByLogId
};
