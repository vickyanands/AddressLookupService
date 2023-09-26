import { AxiosResponse } from "axios";
import { initialUrlForGettingGpsCoordinates } from "../util/constants";
import { GpsCooridnatesResonse } from "../model/GpsCooridnatesResonse";
import { fetchDataFromNSWAdminService } from "../util/common";

interface GPSCoordinatesIF {
    getGPSCoordinatesForAddress: any;
}

const GpsCoordinate: GPSCoordinatesIF = {

    getGPSCoordinatesForAddress: async (address: string) => {
        const url = createUrlForFindingCorrdinates(address);
        const responseData: AxiosResponse = await fetchDataFromNSWAdminService(url);
        const gpsCooridnatesResonseObject = responseData.data as GpsCooridnatesResonse;
        return { gpsCooridnatesResonseObject };
    }

}

export const createUrlForFindingCorrdinates = (address: string) => {
    const coordinatesUrl = new URL(initialUrlForGettingGpsCoordinates);
    coordinatesUrl.searchParams.set("where", "address='" + address.toUpperCase() + "'")
    return coordinatesUrl;
}
export default GpsCoordinate;