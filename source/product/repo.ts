import { QueryResult } from 'pg';
import logging from '../config/logging';
import pool from '../config/pgrepo';
import { NewProductView, Product } from './types';

const NAMESPACE = 'product-repo';

const getProducts = async (searchStr: string = '') => {
    logging.info(NAMESPACE, 'Searching products by name');
    const searchParam = `%${searchStr}%`;
    const QUERY = `SELECT * FROM product WHERE name ILIKE $1 limit 5;`;
    try {
        const response: QueryResult = await (await pool).query(QUERY, [searchParam]);
        return response.rows as Product[];
    } catch (e: any) {
        logging.error(NAMESPACE, e.message, e);
        return [];
    }
};

const createProductFromName = async (name: string) => {
    logging.info(NAMESPACE, 'Creating new product record from name alone');
    const QUERY = `INSERT INTO product (name) VALUES ($1) RETURNING *;`;
    try {
        const response: QueryResult = await (await pool).query(QUERY, [name]);
        return response.rows[0] as Product;
    } catch (e: any) {
        logging.error(NAMESPACE, e.message, e);
        return null;
    }
};

const createProductWithDetails = async (product: NewProductView) => {
    logging.info(NAMESPACE, 'Creating new product record from all available details');
    const { name, category, brandId, purchaseLocationId } = product;
    const QUERY = `INSERT INTO product (name, category, brand_id, purchase_location_id) VALUES ($1,$2, $3, $4) RETURNING *;`;
    try {
        const response: QueryResult = await (await pool).query(QUERY, [name, category, brandId, purchaseLocationId]);
        return response.rows[0] as Product;
    } catch (e: any) {
        logging.error(NAMESPACE, e.message, e);
        return null;
    }
};

export default { getProducts, createProductFromName, createProductWithDetails }