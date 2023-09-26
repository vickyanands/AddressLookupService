import { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2 } from "aws-lambda";
import { Input } from "./model/Input";
import AddressLookupService from "./service/AddressLookupService";
import { createErrorResponseForInternalServerErrors, createErrorResponseForInvalidUserRequest } from "./util/common";
import { internalServerErrorResponse } from "./util/constants";


export const handler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyStructuredResultV2> => {
    try {
        console.log("input Events:")
        console.log(JSON.stringify(event))
        const { address } = event.queryStringParameters as unknown as Input;
        if (address) {
            return await AddressLookupService.lookupAddress(address)
        }
        else {
            return createErrorResponseForInvalidUserRequest("Please enter valid address in Query Param.");
        }
    }
    catch (error) {
        console.error("error while servicing request", error)
        return createErrorResponseForInternalServerErrors(internalServerErrorResponse)
    }

}



