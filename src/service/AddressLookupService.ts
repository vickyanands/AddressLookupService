import { AxiosResponse } from "axios";
import { LatLong } from "../model/LatLong";
import { Output } from "../model/Output";
import {
    createErrorResponseForInternalServerErrors,
    createErrorResponseForInvalidUserRequest,
    createSuccessfullResponse as createSuccessfullResponse
} from "../util/common";
import GPSCoordinates from "../domain/GPSCoordinates";
import StateElectoralDistrictNameAndSuburb from "../domain/StateElectoralDistrictNameAndSuburb";
import { APIGatewayProxyStructuredResultV2 } from "aws-lambda";

interface AddressLooupServiceIF {
    lookupAddress: any
}
/**
 * Address Lookup Service which will call domains for calling other NSW services for finding 
 * required fields for generating response. 
 * Response will have suburb name, State electoral district name and location (Latitude and Longitude)
 *   
 */
const AddressLooupService: AddressLooupServiceIF = {
    lookupAddress: async (address: string): Promise<APIGatewayProxyStructuredResultV2> => {
        try {
            const { gpsCooridnatesResonseObject } =
                await (GPSCoordinates.getGPSCoordinatesForAddress(address));
            if (gpsCooridnatesResonseObject?.features?.length > 0) {
                const gpsCoordonates = gpsCooridnatesResonseObject?.features[0]?.geometry?.coordinates;

                const [responseDataStateElectoralDistrict, respDataForSuburbname] = await StateElectoralDistrictNameAndSuburb
                    .fetchStateEleactoralDisctrictAndSuburbName(gpsCoordonates);

                console.log("responseDataStateElectoralDistrict",
                    responseDataStateElectoralDistrict, respDataForSuburbname);
                console.log("respDataForSuburbname", respDataForSuburbname);

                return createSuccessfullResponse(createOutPut(respDataForSuburbname,
                    getLatitudeLongitudeFromCoordinates(gpsCooridnatesResonseObject),
                    responseDataStateElectoralDistrict));
            }
            else {
                return createErrorResponseForInvalidUserRequest("Address not found. Please enter valid address.")
            }

        } catch (error) {
            return createErrorResponseForInternalServerErrors("Internal Server Error while looking up address. Please try after some time");
        }
    }
}


const getLatitudeLongitudeFromCoordinates = ({ features }) => {
    {
        const [longitude, latitude]: [number, number] = features[0]?.geometry?.coordinates;
        return { longitude, latitude } as LatLong;
    }
}


const createOutPut = (respDataForSuburbname: AxiosResponse<any, any>, coordinatOfAddress: LatLong, responseDataStateElectoralDistrict: AxiosResponse<any, any>): Output => {
    return {
        suburb: <string>respDataForSuburbname.data.features[0].properties.suburbname,
        location: coordinatOfAddress,
        stateElectoralDistrictName: <string>responseDataStateElectoralDistrict.data.features[0].properties.districtname
    };
}

export default AddressLooupService;