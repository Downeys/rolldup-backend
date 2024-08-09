import Pino from "pino";

const logger = Pino({
    name: 'backend',
    level: 'info',
    formatters: {
        level(level) {
            return { level }
        },
    },
});

const info = (namespace: string, message: string, object?: any) => {
    const namespaced = logger.child({ namespace });
    if (object) {
        namespaced.info(object, message);
    } else {
        namespaced.info(message);
    }
};

const warn = (namespace: string, message: string, object?: any) => {
    const namespaced = logger.child({ namespace });
    if (object) {
        namespaced.warn(object, message);
    } else {
        namespaced.warn(message);
    }
};

const error = (namespace: string, message: string, object?: any) => {
    const namespaced = logger.child({ namespace });
    if (object) {
        namespaced.error(object, message);
    } else {
        namespaced.error(message);
    }
};

const debug = (namespace: string, message: string, object?: any) => {
    const namespaced = logger.child({ namespace });
    if (object) {
        namespaced.debug(object, message);
    } else {
        namespaced.debug(message);
    }
};

export default { info, warn, error, debug };
