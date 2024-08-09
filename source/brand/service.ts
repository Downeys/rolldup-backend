import Repo from './repo'
import { Brand, BrandView, NewBrandView } from './types';

const mapBrandRecordsToViews = (brands: Brand[]): BrandView[] => {
    return brands.map(brand => ({
        id: brand.brand_id,
        name: brand.name,
        street: brand.street1,
        street2: brand.street2,
        city: brand.city,
        stateCode: brand.state_code,
        countryCode: brand.country_code,
        phone: brand.phone,
        email: brand.email,
        url: brand.url
    }))
}

export const getBrands = async (searchStr: string = '') => {
    const results = await Repo.getBrands(searchStr);
    return mapBrandRecordsToViews(results);
}

export const createBrandFromName = async (name: string) => {
    return await Repo.createBrandFromName(name);
}

export const createBrandWithDetails = async (brand: NewBrandView) => {
    const newBrand: NewBrandView = {
        name: brand.name || 'Name not provided',
        street: brand.street || '',
        street2: brand.street2 || '',
        city: brand.city || '',
        stateCode: brand.stateCode || '',
        countryCode: brand.countryCode || '',
        phone: brand.phone || '',
        email: brand.email || '',
        url: brand.url || ''
    }
    return await Repo.createBrandWithDetails(newBrand);

}

export default { getBrands, createBrandFromName, createBrandWithDetails }
