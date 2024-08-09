import logging from '../config/logging';
import userRepo from '../users/repo'
import { ILog } from '../interfaces';
import notificationService from '../notifications/service';
import contentService from '../content/service';
import repo from './repo';
import { AdB2cUser } from '../auth/service';
import PurchaseLocationService from '../purchase-locations/service'
import BrandService from '../brand/service'
import ProductService from '../product/service'

const NAMESPACE = 'strain-logs-service';

// log validation

const reviewIsValid = (review: string) => {
    //should be no more than 300 characters
    return review.length < 300;
};

const ratingIsValid = (rating: number) => {
    //should be number between 1-5 inclusive
    return rating > 0 && rating < 6;
};

const userIdIsValid = async (userId: number) => {
    return await userRepo.getUserByUserId(userId);
};

const logIsValid = (log: any) => {
    return ratingIsValid(log.rating) && reviewIsValid(log.review) && userIdIsValid(log.ownerId);
};

///////////

export const searchStrainByName = async (name: string) => {
    logging.info(NAMESPACE, 'Searching for strain: ' + name);
    return (await repo.searchStrainByName(name)) as any[];
};

const checkIfFavoriteExists = async (userId: number, logId: number) => {
    logging.info(NAMESPACE, 'Checking if favorite exists');
    return await repo.getFavoritesByDetails(userId, logId);
};

const checkIfBookmarkExists = async (userId: number, logId: number) => {
    logging.info(NAMESPACE, 'Checking if bookmark exists');
    return await repo.getBookmarksByDetails(userId, logId);
};

const checkIfLogExists = async (logId: number) => {
    logging.info(NAMESPACE, 'Checking if log exists');
    return (await repo.getStrainLogByLogId(logId)) as ILog[];
};

const createStrainInDb = async (name: string, category: string, strain: string) => {
    logging.info(NAMESPACE, 'Creating strain in db');
    const newStrain = { name, category, strain };
    const resp = (await repo.createNewStrain(newStrain)) as any[];
    return resp[0]?.strain_id;
};

const createStrainLogInDb = async (log: any) => {
    logging.info(NAMESPACE, 'Creating log in db');
    return await repo.createNewStrainLog(log);
};

const createStrainLogPctInDb = async (log: any) => {
    logging.info(NAMESPACE, 'Creating log in db');
    return await repo.createNewStrainLogPcnt(log);
};

const createStrainLogMgsInDb = async (log: any) => {
    logging.info(NAMESPACE, 'Creating log in db');
    return await repo.createNewStrainLogMgs(log);
};

const createCommentInDb = async (comment: any) => {
    logging.info(NAMESPACE, 'Creating comment in db');
    const { userId, logId, message } = comment;
    return await repo.createNewComment(userId, logId, message);
};

const createFavoriteRecordInDb = async (userId: number, logId: number) => {
    logging.info(NAMESPACE, 'Creating favorite in db');
    return await repo.createFavorite(userId, logId);
};

const removeFavoriteRecordInDb = async (favoriteId: number) => {
    logging.info(NAMESPACE, 'Removing favorite from db');
    return await repo.deleteFavorite(favoriteId);
};

const createBookmarkRecordInDb = async (userId: number, logId: number) => {
    logging.info(NAMESPACE, 'Creating bookmark in db');
    const bookmarkAlreadyExists = (await checkIfBookmarkExists(userId, logId)) as any[];
    if (bookmarkAlreadyExists.length === 0) {
        return await repo.createBookmark(userId, logId);
    }
};

const removeBookmarkRecordInDb = async (userId: number, logId: number) => {
    logging.info(NAMESPACE, 'Removing bookmark from db');
    const bookmarkExists = (await checkIfBookmarkExists(userId, logId)) as any[];
    if (bookmarkExists.length !== 0) {
        return await repo.deleteBookmark(bookmarkExists[0].bookmark_id);
    }
};

interface IFav {
    callingUser: { userId: number };
    recipient: string;
    logId: number;
    action: string;
}

export const addFavorite = async (favRequest: IFav) => {
    logging.info(NAMESPACE, 'Adding a favorite');
    const { recipient, logId } = favRequest;
    const recipientId = (await userRepo.getUserByUsername(recipient) as any[])[0]?.user_id;
    const engagerId = favRequest.callingUser?.userId;
    const engager = (await userRepo.getUserByUserId(engagerId)) as any[];

    const favoriteAlreadyExists = (await checkIfFavoriteExists(engagerId, logId)) as any[];
    if (favoriteAlreadyExists.length === 0) {
        await notificationService.createNotification({ logId, engagerId, recipientId, type: 'favorite', message: `${engager[0].username} favorited your post.` });
        return await createFavoriteRecordInDb(engagerId, logId);
    }
};

export const removeFavorite = async (favRequest: IFav) => {
    logging.info(NAMESPACE, 'Adding or removing a favorite');
    const { logId } = favRequest;
    const engagerId = favRequest.callingUser.userId;
    const favoriteAlreadyExists = (await checkIfFavoriteExists(engagerId, logId)) as any[];
    if (favoriteAlreadyExists.length !== 0) return await removeFavoriteRecordInDb(favoriteAlreadyExists[0].favorite_id);
};

export const createNewCommentInDb = async (comment: any) => {
    logging.info(NAMESPACE, 'Creating new comment');
    const recipientUser = (await userRepo.getUserByUsername(comment.recipient)) as any[];
    const recipientId = recipientUser?.[0].user_id || -1;
    const log: ILog[] = await checkIfLogExists(comment.logId);
    const logId = log ? comment.logId : -1;
    if (logId !== -1 && recipientId !== -1) {
        await notificationService.createNotification({ logId, engagerId: comment.callingUser.userId, recipientId, type: 'comment', message: `${comment.engager} commented on your post.` });
        return await createCommentInDb({ logId, userId: comment.callingUser.userId, message: comment.message });
    }
};

export const deleteStrainLog = async (logId: number, user: AdB2cUser) => {
    logging.info(NAMESPACE, 'Deleting strain log');

    const logToDelete = await repo.getStrainLogByLogId(logId) as ILog[];
    if (logToDelete[0]?.user_id === user.userId || new Set(user.appRoles).has('ADMIN')) {
        return await repo.deleteStrainLog(logId);
    }
};

const saveImage = async (image: any) => {
    let imageUrl;
    try {
        imageUrl = await contentService.uploadStrainLogImage(image);
    } catch (e: any) {
        logging.error(NAMESPACE, 'Failed to upload image to blob storage: ' + e.message);
        throw e;
    }
    return imageUrl;
}

export const updateStrainLog = async (log: any, image: any) => {
    logging.info(NAMESPACE, 'Updating log');

    const existingLog = await repo.getStrainLogByLogId(log.id) as ILog[];
    const strainId = await getStrainId(log.strainId, log.strainName, log.category, log.strain);
    const locationId = await getLocationId(log.purchaseLocationId, log.purchaseLocationName);
    const brandId = log.brandName ? await getBrandId(log.brandId, log.brandName) : null;
    const productId = log.productName ? await getProductId(log.productId, log.productName) : null;

    if (existingLog[0].user_id !== log.callingUser.userId) throw new Error("Failed to update log. Requesting user does not own this log.")

    let imageUrl;
    if (image) imageUrl = image && await saveImage(image);
    const updatedLog = { ...log, picUrl: imageUrl || log.picUrl, strainId, locationId, brandId, productId }
    await repo.updateLogByStrainLogId(updatedLog);
    if (imageUrl) contentService.deleteStrainLogImage(log.picUrl);
    return log.id;
}

const getStrainId = async (strainId: number | undefined, name: string, category: string, strain: string) => {
    if (!strainId) {
        return await createStrainInDb(name, category, strain);
    }
    return strainId;
}

const getLocationId = async (locationId: number | undefined, locationName: string = '') => {
    if (!locationId) {
        const newLocation = await PurchaseLocationService.createPurchaseLocatinoFromName(locationName);
        return newLocation?.purchase_location_id;
    }
    return locationId;
}

const getBrandId = async (brandId: number | undefined, brandName: string) => {
    if (!brandId) {
        const newBrand = await BrandService.createBrandFromName(brandName);
        return newBrand?.brand_id;
    }
    return brandId;
}

const getProductId = async (productId: number | undefined, productName: string) => {
    if (!productId) {
        const newProduct = await ProductService.createProductFromName(productName);
        return newProduct?.product_id;
    }
    return productId;
}

export const createNewLogInDb = async (log: any, image: any) => {
    logging.info(NAMESPACE, 'Creating new log');

    const imageUrl = image && await saveImage(image);
    const strainId = await getStrainId(log.strainId, log.strainName, log.category, log.strain);
    const locationId = await getLocationId(log.purchaseLocationId, log.purchaseLocationName);
    const brandId = log.brandName ? await getBrandId(log.brandId, log.brandName) : null;
    const productId = log.productName ? await getProductId(log.productId, log.productName) : null;

    const newLog = {
        userId: log.callingUser.userId,
        strainId,
        cannabinoid: log.cannabinoid,
        percentage: log.percentage,
        mgs: log.mgs,
        rating: log.rating,
        review: log.review,
        purchaseLocationId: locationId,
        picUrl: imageUrl,
        brandId,
        productId
    };
    if (strainId !== 0 && logIsValid(newLog)) {
        if (log.category === 'Flower' || log.category === 'Concentrate' || log.category === 'Cartridge' || log.category === 'PreRoll') return await createStrainLogPctInDb(newLog);
        if (log.category === 'Edible') return await createStrainLogMgsInDb(newLog);
        return await createStrainLogInDb(newLog);
    }
};

export default {
    createNewLogInDb,
    createNewCommentInDb,
    addFavorite,
    removeFavorite,
    createBookmarkRecordInDb,
    removeBookmarkRecordInDb,
    searchStrainByName,
    deleteStrainLog,
    updateStrainLog
};
