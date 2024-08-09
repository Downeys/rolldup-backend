import Repo from './repo'
import { NewProductView, Product, ProductView } from './types';

const mapProductRecordsToViews = (products: Product[]): ProductView[] => {
    return products.map(product => ({
        id: product.product_id,
        name: product.name,
        category: product.category,
        brandId: product.brand_id,
        purchaseLocationId: product.purchase_location_id
    }))
}

export const getProducts = async (searchStr: string = '') => {
    const results = await Repo.getProducts(searchStr);
    return mapProductRecordsToViews(results);
}

export const createProductFromName = async (name: string) => {
    return await Repo.createProductFromName(name);
}

export const createProductWithDetails = async (product: NewProductView) => {
    const newProduct: NewProductView = {
        name: product.name || 'Name not provided',
        category: product.category || 'Category not provided',
        brandId: product.brandId || -1,
        purchaseLocationId: product.purchaseLocationId || -1
    }
    return await Repo.createProductWithDetails(newProduct);
}

export default { getProducts, createProductFromName, createProductWithDetails }
