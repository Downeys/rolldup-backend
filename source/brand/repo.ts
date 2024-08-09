import { QueryResult } from 'pg';
import logging from '../config/logging';
import pool from '../config/pgrepo';
import { Brand, BrandView, NewBrandView } from './types';

const NAMESPACE = 'brand-repo';

const getBrands = async (searchStr: string = '') => {
    logging.info(NAMESPACE, 'Searching brands by name');
    const searchParam = `%${searchStr}%`;
    const QUERY = `SELECT * FROM brand WHERE name ILIKE $1 limit 5;`;
    try {
        const response: QueryResult = await (await pool).query(QUERY, [searchParam]);
        return response.rows as Brand[];
    } catch (e: any) {
        logging.error(NAMESPACE, e.message, e);
        return [];
    }
};

const createBrandFromName = async (name: string) => {
    logging.info(NAMESPACE, 'Creating new brand record from name alone');
    const QUERY = `INSERT INTO brand (name) VALUES ($1) RETURNING *;`;
    try {
        const response: QueryResult = await (await pool).query(QUERY, [name]);
        return response.rows[0] as Brand;
    } catch (e: any) {
        logging.error(NAMESPACE, e.message, e);
        return null;
    }
};

const createBrandWithDetails = async (brand: NewBrandView) => {
    logging.info(NAMESPACE, 'Creating new brand record from all available details');
    const { name, street, street2, city, stateCode, countryCode, phone, email, url } = brand;
    const QUERY = `INSERT INTO brand (
        name,
        street1,
        street2,
        city,
        state_code,
        country_code,
        phone,
        email,
        url
    ) VALUES ($1,$2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *;`;
    try {
        const response: QueryResult = await (await pool).query(QUERY, [name, street, street2, city, stateCode, countryCode, phone, email, url]);
        return response.rows[0] as Brand;
    } catch (e: any) {
        logging.error(NAMESPACE, e.message, e);
        return null;
    }
};

export default { getBrands, createBrandFromName, createBrandWithDetails }