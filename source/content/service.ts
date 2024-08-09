import { BlobServiceClient } from '@azure/storage-blob';
import logging from '../config/logging';
import { v1 } from 'uuid';
import sharp from 'sharp';
import config from '../config/config';
import moderation from './moderation';

const APP_MAX_WIDTH = 640;
const NAMESPACE = 'content-service';

async function buildBlobClient() {
    return BlobServiceClient.fromConnectionString((await config).blob.connectionString);
}

const blobServiceClient = buildBlobClient();

const optimize = async (input: Buffer): Promise<Buffer> => await sharp(input, { failOn: 'none' })
    .rotate()
    .resize({ width: APP_MAX_WIDTH, withoutEnlargement: true })
    .webp()
    .toBuffer();

export const uploadProfilePic = async (image: any) => {
    logging.info(NAMESPACE, 'Uploading profile picture');
    const containerClient = (await blobServiceClient).getContainerClient((await config).blob.profilePicContainer);
    const blobName = v1() + image.originalname;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    const optimized = await optimize(image.buffer);
    await moderation.throwOnOffensiveImage(optimized);
    const uploadBlobResponse = await blockBlobClient.upload(optimized, optimized.byteLength);
    logging.info(NAMESPACE, `Blob was uploaded successfully. requestId: ${uploadBlobResponse.requestId}`);
    const imageUrl = (await config).blob.profilePicUrl + blobName;
    return imageUrl;
};

export const uploadStrainLogImage = async (image: any) => {
    logging.info(NAMESPACE, 'Uploading photo');
    const containerClient = (await blobServiceClient).getContainerClient((await config).blob.imageContainer);
    const blobName = v1() + image.originalname;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    const optimized = await optimize(image.buffer);
    await moderation.throwOnOffensiveImage(optimized);
    const uploadBlobResponse = await blockBlobClient.upload(optimized, optimized.byteLength);
    logging.info(NAMESPACE, 'Blob was uploaded successfully', { requestId: uploadBlobResponse.requestId });
    const imageUrl = (await config).blob.photoContentUrl + blobName;
    return imageUrl;
};

export const deleteStrainLogImage = async (imageUrl: string) => {
    logging.info(NAMESPACE, 'Delete photo');
    const containerClient = (await blobServiceClient).getContainerClient((await config).blob.imageContainer);
    const photoContentUrl = (await config).blob.photoContentUrl;
    const blobName = imageUrl.split(photoContentUrl)[1];
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    const response = await blockBlobClient.deleteIfExists();
    return response;
}

export default { uploadStrainLogImage, uploadProfilePic, deleteStrainLogImage };
