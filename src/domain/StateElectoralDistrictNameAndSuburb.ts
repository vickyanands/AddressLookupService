import { fetchDataFromNSWAdminService } from "../util/common";
import { initialUrlForGettingStateElectoralDistrict, initialUrlForGettingSuburbName } from "../util/constants";

interface StateElectoralDistrictNameAndSuburbNameIF {
    fetchStateEleactoralDisctrictAndSuburbName: any
}

const StateElectoralDistrictNameAndSuburb: StateElectoralDistrictNameAndSuburbNameIF = {
    fetchStateEleactoralDisctrictAndSuburbName: (gpsCoordonates) => {
        return Promise.all([fetchDataFromNSWAdminService(createUrlForFindingStateElectoralDistrictOrSuburb(gpsCoordonates, 'StateElectoralDistrict')), fetchDataFromNSWAdminService(createUrlForFindingStateElectoralDistrictOrSuburb(gpsCoordonates, "Suburb"))]);
    }
}
export const createUrlForFindingStateElectoralDistrictOrSuburb = (coordinates: Array<number>, option: 'StateElectoralDistrict' | 'Suburb') => {
    const urlForGettingAdministartiveBoundryTheme = new URL(option === 'StateElectoralDistrict' ? initialUrlForGettingStateElectoralDistrict : initialUrlForGettingSuburbName);
    urlForGettingAdministartiveBoundryTheme.searchParams.set("geometry", coordinates.toString())
    return urlForGettingAdministartiveBoundryTheme.toString();
}
export default StateElectoralDistrictNameAndSuburb;