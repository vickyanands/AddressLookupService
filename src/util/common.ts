import { APIGatewayProxyStructuredResultV2 } from "aws-lambda"
import { Output } from "../model/Output"
import axios from "axios"

export const createErrorResponseForInvalidUserRequest = (message) => {
    return {
        statusCode: 400,
        body: JSON.stringify({ error: message }),
    }
}

export const createErrorResponseForInternalServerErrors = (error) => {
    return {
        statusCode: 500,
        body: JSON.stringify({ error }),
    }
}

export const createSuccessfullResponse = (output: Output): APIGatewayProxyStructuredResultV2 | PromiseLike<APIGatewayProxyStructuredResultV2> => {
    return {
        statusCode: 200,
        body: JSON.stringify(output),
    };
}
/**
 * Fetches Data from external services using Axios library.
 * @param url 
 * @returns 
 */
export let fetchDataFromNSWAdminService = (url: string) => {
    console.log("url for searching data", url);
    return axios.get(url.toString());
}
