import fetch from 'node-fetch';
import eventuallyConfig from '../config/config';
import logging from '../config/logging';

interface Adult {
    isAdultContent: boolean;
    isRacyContent: boolean;
    isGoryContent: boolean;
    adultScore: number;
    racyScore: number;
    goreScore: number;
}

interface Metadata {
    height: number;
    width: number;
    format: string;
}

interface AnalyzeResult {
    adult: Adult;
    requestId: string;
    modelVersion: string;
    metadata: Metadata;
}

const NAMESPACE = "moderation";

const throwOnOffensiveImage = async (imageData: Buffer) => {
    const { computerVision } = await eventuallyConfig;
    if (computerVision.endpoint && computerVision.accessKey) {
        const response = await fetch(`${computerVision.endpoint}vision/v3.2/analyze?visualFeatures=Adult&model-version=latest`, {
            method: 'POST',
            headers: {
                'content-type': 'application/octet-stream',
                'Ocp-Apim-Subscription-Key': computerVision.accessKey,
            },
            body: imageData,
        });
        const responseBody = await response.json();
        if (response.status === 200) {
            const result = responseBody as AnalyzeResult;
            logging.info(NAMESPACE, "processed image", result);
            if (result.adult.isAdultContent || result.adult.isRacyContent || result.adult.isGoryContent) {
                throw new Error("content is offensive");
            }
        } else {
            logging.warn(NAMESPACE, "computer vision returned an error, image data will not be allowed without auto-moderation", {
                status: response.status,
                ...responseBody,
            });
        }
    } else {
        logging.info(NAMESPACE, "defaulting to a no-op due to missing configuration");
    }
};

export default {
    throwOnOffensiveImage,
};
