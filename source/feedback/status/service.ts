import logging from '../../config/logging';
import cursorUtils from '../../utils/cursor-utils';
import repo from './repo';
import StrainLogRepo from '../../strain-logs/repo';

const NAMESPACE = 'feedback-status-service';

const constructHelpRequestStatusViews = (statuses: any[]) => statuses.map(status => (
    {
        statusId: status.help_request_status_id,
        feedbackId: status.help_request_id,
        category: status.category,
        status: status.status,
        actionTaken: status.action_taken,
        notes: status.notes,
        message: status.message,
        userId: status.user_id,
        timeLogged: status.time_logged,
        timeClosed: status.time_closed
    }
));

export const getHelpRequestStatuses = async (cursor: any, limit: number, status: string) => {
    logging.info(NAMESPACE, 'Getting help request statuses');
    const statuses = (status !== 'undefined')
        ? await repo.getHelpRequestStatusesByStatus(status, cursor, limit) as any[]
        : await repo.getHelpRequestStatuses(cursor, limit) as any[];
    const newCursor = await cursorUtils.constructCursor(statuses, "help_request_status_id", "time_logged");
    const statusViews = constructHelpRequestStatusViews(statuses)
    return { data: statusViews, cursor: newCursor };
}

const constructUserFeedbackStatusViews = (statuses: any[]) => statuses.map(status => (
    {
        statusId: status.user_feedback_status_id,
        feedbackId: status.user_feedback_id,
        category: status.category,
        status: status.status,
        actionTaken: status.action_taken,
        notes: status.notes,
        message: status.message,
        userId: status.user_id,
        timeLogged: status.time_logged,
        timeClosed: status.time_closed
    }
));

export const getUserFeedbackStatuses = async (cursor: any, limit: number, status: string) => {
    logging.info(NAMESPACE, 'Getting user feedback statuses');
    const statuses = (status !== 'undefined')
        ? await repo.getUserFeedbackStatusesByStatus(status, cursor, limit) as any[]
        : await repo.getUserFeedbackStatuses(cursor, limit) as any[];
    const newCursor = await cursorUtils.constructCursor(statuses, "user_feedback_status_id", "time_logged");
    const statusViews = constructUserFeedbackStatusViews(statuses)
    return { data: statusViews, cursor: newCursor };
}

const getFlaggedContent = async (contentType: string, contentId: number) => {
    if (contentType === 'comment') {
        const content = await StrainLogRepo.getCommentByCommentId(contentId) as any[]
        return { message: content?.[0].comment_message, picUrl: 'N/A' }
    }
    const content = await StrainLogRepo.getStrainLogByLogId(contentId) as any[]
    return { message: content?.[0]?.review, picUrl: content?.[0]?.pic_url }
}

const constructFlaggedContentStatusViews = async (statuses: any[]) => {
    let flaggedContentStatusViews: any[] = [];
    for (let i = 0; i < statuses.length; i++) {
        const content = await getFlaggedContent(statuses[i].content_type, statuses[i].content_id);
        flaggedContentStatusViews.push({
            statusId: statuses[i].flagged_content_status_id,
            feedbackId: statuses[i].flagged_content_id,
            category: statuses[i].category,
            status: statuses[i].status,
            actionTaken: statuses[i].action_taken,
            notes: statuses[i].notes,
            message: content.message,
            picUrl: content.picUrl,
            userId: statuses[i].user_id,
            timeLogged: statuses[i].time_logged,
            timeClosed: statuses[i].time_closed
        })
    }
    return flaggedContentStatusViews;
}

export const getFlaggedContentStatuses = async (cursor: any, limit: number, status: string) => {
    logging.info(NAMESPACE, 'Getting flagged content statuses');
    const statuses = (status !== 'undefined')
        ? await repo.getFlaggedContentStatusesByStatus(status, cursor, limit) as any[]
        : await repo.getFlaggedContentStatuses(cursor, limit) as any[];
    const newCursor = await cursorUtils.constructCursor(statuses, "flagged_content_status_id", "time_logged");
    const statusViews = await constructFlaggedContentStatusViews(statuses)
    return { data: statusViews, cursor: newCursor };
}

export const updateFlaggedContentStatus = async (id: number, category: string, action: string, notes: string, status: string) => {
    logging.info(NAMESPACE, 'Updating flagged content status');
    return await repo.updateFlaggedContentStatus(id, category, action, notes, status);
}

export const updateHelpRequestStatus = async (id: number, category: string, action: string, notes: string, status: string) => {
    logging.info(NAMESPACE, 'Updating help request status');
    return await repo.updateHelpRequestStatus(id, category, action, notes, status);
}

export const updateUserFeedbackStatus = async (id: number, category: string, action: string, notes: string, status: string) => {
    logging.info(NAMESPACE, 'Updating user feedback status');
    return await repo.updateUserFeedbackStatus(id, category, action, notes, status);
}

export const searchHelpRequestStatuses = async (searchTerm: string) => {
    const searchResults = await repo.searchHelpRequestStatus(searchTerm) as any[];
    return constructHelpRequestStatusViews(searchResults);
}

export const searchUserFeedbackStatuses = async (searchTerm: string) => {
    const searchResults = await repo.searchUserFeedbackStatus(searchTerm) as any[];
    return constructUserFeedbackStatusViews(searchResults);
}

export const searchFlaggedContentStatuses = async (searchTerm: string) => {
    const searchResults = await repo.searchFlaggedContentStatus(searchTerm) as any[];
    return constructFlaggedContentStatusViews(searchResults);
}

export default {
    getHelpRequestStatuses,
    getUserFeedbackStatuses,
    getFlaggedContentStatuses,
    updateFlaggedContentStatus,
    updateHelpRequestStatus,
    updateUserFeedbackStatus,
    searchHelpRequestStatuses,
    searchUserFeedbackStatuses,
    searchFlaggedContentStatuses
}