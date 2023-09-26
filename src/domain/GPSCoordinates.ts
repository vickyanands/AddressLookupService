import { AxiosResponse } from "axios";
import { initialUrlForGettingGpsCoordinates } from "../util/constants";
import { GpsCooridnatesResonse } from "../model/GpsCooridnatesResonse";
import { fetchDataFromNSWAdminService } from "../util/common";

interface GPSCoordinatesIF {
    getGPSCoordinatesForAddress: any;
}

/**
 * Functions is used to find GPS Coordinates using NSW_Geocoded_Addressing_Theme service.  
 */
const GpsCoordinate: GPSCoordinatesIF = {

    getGPSCoordinatesForAddress: async (address: string) => {
        const url = createUrlForFindingCorrdinates(address);
        const responseData: AxiosResponse = await fetchDataFromNSWAdminService(url);
        const gpsCooridnatesResonseObject = responseData.data as GpsCooridnatesResonse;
        return { gpsCooridnatesResonseObject };
    }

}
/**
 * Creates Url after adding addresss received as argument. 
 * @param address 
 * @returns 
 */
export const createUrlForFindingCorrdinates = (address: string): string => {
    const coordinatesUrl = new URL(initialUrlForGettingGpsCoordinates);
    coordinatesUrl.searchParams.set("where", "address='" + address.toUpperCase() + "'")
    return coordinatesUrl.toString();
}
export default GpsCoordinate;