import Repo from './repo'
import { PurchaseLocation, PurchaseLocationView } from './types';

const mapPurchaseLocationsToViews = (purchaseLocations: PurchaseLocation[]): PurchaseLocationView[] => {
    return purchaseLocations.map(location => ({
        purchaseLocationId: location.purchase_location_id,
        name: location.name,
        street1: location.street1,
        street2: location.street2,
        city: location.city,
        stateCode: location.state_code,
        countryCode: location.country_code,
        phone: location.phone,
        email: location.email,
        url: location.url
    }))
}

export const getPurchaseLocations = async (searchStr: string = '') => {
    const results = await Repo.getPurchaseLocations(searchStr);
    return mapPurchaseLocationsToViews(results);
}

export const createPurchaseLocatinoFromName = async (name: string) => {
    return await Repo.createPurchaseLocationFromName(name);
}

export default { getPurchaseLocations, createPurchaseLocatinoFromName }
