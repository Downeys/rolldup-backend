import logging from '../config/logging';
import repo from './repo';

const NAMESPACE = 'user-feedback-service';

export const createHelpRequestRecordInDb = async (helpRequest: any) => {
    logging.info(NAMESPACE, 'Creating help request record in db');
    return await repo.createHelpRequestRecord(helpRequest);
};

export const createFlaggedConentRecordInDb = async (reportedContent: any) => {
    logging.info(NAMESPACE, 'Creating reported content record in db');
    return await repo.createFlaggedContentRecord(reportedContent);
};

export const createUserFeedbackRecordInDb = async (feedback: any) => {
    logging.info(NAMESPACE, 'Creating user feedback record in db');
    return await repo.createFeedbackRecord(feedback);
};

export default { createUserFeedbackRecordInDb, createFlaggedConentRecordInDb, createHelpRequestRecordInDb }