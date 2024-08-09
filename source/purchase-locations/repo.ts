import { QueryResult } from 'pg';
import logging from '../config/logging';
import pool from '../config/pgrepo';
import { PurchaseLocation } from './types';

const NAMESPACE = 'purchase-locations-repo';

const getPurchaseLocations = async (searchStr: string = '') => {
    logging.info(NAMESPACE, 'Searching purchase location by name');
    const searchParam = `%${searchStr}%`;
    const QUERY = `SELECT * FROM purchase_location WHERE name ILIKE $1 limit 5;`;
    try {
        const response: QueryResult = await (await pool).query(QUERY, [searchParam]);
        return response.rows as PurchaseLocation[];
    } catch (e: any) {
        logging.error(NAMESPACE, e.message, e);
        return [];
    }
};

const createPurchaseLocationFromName = async (name: string) => {
    logging.info(NAMESPACE, 'Creating new purchase location record from name alone');
    const QUERY = `INSERT INTO purchase_location (name) VALUES ($1) RETURNING *;`;
    try {
        const response: QueryResult = await (await pool).query(QUERY, [name]);
        return response.rows[0] as PurchaseLocation;
    } catch (e: any) {
        logging.error(NAMESPACE, e.message, e);
        return null;
    }
};

export default { getPurchaseLocations, createPurchaseLocationFromName }