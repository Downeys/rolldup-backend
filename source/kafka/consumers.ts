import logging from '../config/logging';
import userRepo from '../users/repo';
import badgeRepo from '../badge/repo';
import kafka from './config';
import notifications from '../notifications/service';

interface UserId {
    user_id: number;
}

interface RankUpdate {
    label: string;
    user_id: UserId;
}

interface Badge {
    label: string;
    level: string;
    user_id: UserId;
}

const consumeBadgeUpdates = async () => {
    const consumer = kafka.consumer({ groupId: 'backend-badge' });
    await consumer.connect();
    await consumer.subscribe({ topic: 'interaction_rewards.badge', fromBeginning: true });

    await consumer.run({
        autoCommitInterval: 1000,
        eachMessage: async ({ topic, partition, message }) => {
            logging.debug('badge listener', 'received message', { topic, partition, ...message });
            try {
                const payload = message?.value?.toString();
                if (payload) {
                    const badge = JSON.parse(payload) as Badge;
                    if (await badgeRepo.createBadge(badge.user_id.user_id, badge.label, badge.level)) {
                        await notifications.createNotification({
                            recipientId: badge.user_id.user_id,
                            message: "You earned a new badge!",
                            type: 'badge',
                            additionalProperties: {
                                label: badge.label,
                                level: badge.level,
                            },
                        });
                    }
                }
            } catch (err) {
                logging.error('badge listener', 'error processing badge message', { topic, partition, err });
            }
        },
    });
}

const consumeRankUpdates = async () => {
    const consumer = kafka.consumer({ groupId: 'backend' });
    await consumer.connect();
    await consumer.subscribe({ topic: 'interaction_rewards.rank', fromBeginning: true });

    await consumer.run({
        autoCommitInterval: 1000,
        eachMessage: async ({ topic, partition, message }) => {
            logging.debug('rank listener', 'received message', { topic, partition, ...message });
            try {
                const payload = message?.value?.toString();
                if (payload) {
                    const update = JSON.parse(payload) as RankUpdate;
                    if (await userRepo.updateRank(update.user_id.user_id, update.label)) {
                        await notifications.createNotification({
                            recipientId: update.user_id.user_id,
                            message: "You're getting higher!",
                            type: 'rank',
                            additionalProperties: {
                                newRankLabel: update.label,
                            },
                        });
                    }
                }
            } catch (err) {
                logging.error('rank listener', 'error processing rank message', { topic, partition, err });
            }
        },
    });
};

const notificationListeners: { [key: string]: (notification: any) => void } = {};

const addNotificationListener = (id: string, callback: (notification: any) => void) => {
    notificationListeners[id] = callback;
};

const removeNotificationListener = (id: string) => {
    delete notificationListeners[id];
};

const consumeNotifications = async () => {
    const consumer = kafka.consumer({ groupId: `${process.env.POD_NAME}-notifications` || 'backend-notifications' });
    await consumer.connect();
    await consumer.subscribe({ topic: 'backend.public.notifications', fromBeginning: false });
    const opTypes = new Set<string>(["c", "u", "r"]);
    await consumer.run({
        autoCommitInterval: 1000,
        eachMessage: async ({ topic, partition, message }) => {
            try {
                const messageValue = message?.value?.toString();
                if (messageValue) {
                    const payload = JSON.parse(messageValue).payload;
                    if (opTypes.has(payload.op)) {
                        Object.keys(notificationListeners).forEach(listener => {
                            try {
                                notificationListeners[listener](payload.after);
                            } catch (err) {
                                logging.warn('notifications listener', 'listener threw an error', { listener, topic, partition, err });
                            }
                        });
                    }
                }
            } catch (err) {
                logging.error('notifications listener', 'error processing notification message', { topic, partition, err });
            }
        },
    });
};

const startConsumers = async () => {
    await consumeRankUpdates();
    await consumeBadgeUpdates();
    await consumeNotifications();
};

export {
    startConsumers,
    addNotificationListener,
    removeNotificationListener,
};
