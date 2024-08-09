import logging from "../config/logging";

const NAMESPACE = 'cursor-utils';

export const encodeCursor = async (cursor: any) => {
    let encodedCursor;
    const stringifiedCursor = JSON.stringify(cursor);
    try {
        encodedCursor = btoa(stringifiedCursor);
    } catch (e: any) {
        logging.error(NAMESPACE, 'An error occured while encoding the cursor: ' + e.message);
    }
    return encodedCursor;
}

export const decodeCursor = async (cursor: string) => {
    if (cursor.length > 0 && cursor !== 'null') {
        let decodedCursor;
        try {
            decodedCursor = atob(cursor);
        } catch (e: any) {
            logging.error(NAMESPACE, 'An error occured while decoding the cursor: ' + e.message);
        }
        const parsedCursor = decodedCursor && JSON.parse(decodedCursor);
        return parsedCursor;
    }
    return null
}

const constructCursor = async (feed: any[], primary: string, secondary: string) => {
    const newCursor = await encodeCursor({ [primary]: feed[feed.length - 1]?.[primary], [secondary]: feed[feed.length - 1]?.[secondary] })
    return newCursor;
}

export default { encodeCursor, decodeCursor, constructCursor }