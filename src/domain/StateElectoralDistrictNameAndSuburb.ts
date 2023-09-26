import { fetchDataFromNSWAdminService } from "../util/common";
import { initialUrlForGettingStateElectoralDistrict, initialUrlForGettingSuburbName } from "../util/constants";

interface StateElectoralDistrictNameAndSuburbNameIF {
    fetchStateEleactoralDisctrictAndSuburbName([]);
}

/**
 * Fetches district name and suburb name for supplied coordinates parallelly. 
 * Returns  
 */
const StateElectoralDistrictNameAndSuburb: StateElectoralDistrictNameAndSuburbNameIF = {
    fetchStateEleactoralDisctrictAndSuburbName: (gpsCoordonates: []) => {
        return Promise.all([fetchDataFromNSWAdminService(createUrlForFindingStateElectoralDistrictOrSuburb(gpsCoordonates, 'StateElectoralDistrict')), fetchDataFromNSWAdminService(createUrlForFindingStateElectoralDistrictOrSuburb(gpsCoordonates, "Suburb"))]);
    }
}
/**
 * It generated URL for fetching State Electoral District Name and Suburb name from different services.
 * @param coordinates 
 * @param option 
 * @returns 
 */
export const createUrlForFindingStateElectoralDistrictOrSuburb = (coordinates: Array<number>, option: 'StateElectoralDistrict' | 'Suburb'): string => {
    const urlForGettingAdministartiveBoundryTheme = new URL(option === 'StateElectoralDistrict' ? initialUrlForGettingStateElectoralDistrict : initialUrlForGettingSuburbName);
    urlForGettingAdministartiveBoundryTheme.searchParams.set("geometry", coordinates.toString())
    return urlForGettingAdministartiveBoundryTheme.toString();
}
export default StateElectoralDistrictNameAndSuburb;