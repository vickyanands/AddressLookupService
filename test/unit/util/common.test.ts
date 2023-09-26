import { describe, it } from "mocha";
import { strictEqual } from "assert";
import Sinon from "sinon";
import axios, { AxiosResponse } from 'axios';
import * as common from "../../../src/util/common"
import { Output } from "../../../src/model/Output";
import { APIGatewayProxyStructuredResultV2 } from "aws-lambda";

describe('should fetchDataFromNSWAdminService ', () => {
    const sandbox = Sinon.createSandbox();
    afterEach(() => {
        sandbox.restore()
    });
    it('should fetchDataFromNSWAdminService call a url with axios object ', () => {
        const axiosStub = sandbox.stub(axios, 'get').resolves({});
        common.fetchDataFromNSWAdminService("url");
        strictEqual(axiosStub.calledOnce, true);
    });

    it('should create createSuccessfullResponse', () => {
        const output: Output = {
            location: { latitude: 11, longitude: 122 },
            stateElectoralDistrictName: "districtName",
            suburb: "suburb"
        }
        const result: APIGatewayProxyStructuredResultV2 | any = common.createSuccessfullResponse(output);
        strictEqual(result.statusCode, 200);
        strictEqual(result.body, JSON.stringify(output));
    });
    it('should create createErrorResponseForInvalidUserRequest', () => {
        const message: string = "invalid user request"
        const result: APIGatewayProxyStructuredResultV2 | any = common.createErrorResponseForInvalidUserRequest(message);
        strictEqual(result.statusCode, 400);
        strictEqual(result.body, JSON.stringify({ error: message }));
    });
    it('should create createErrorResponseForInternalServerErrors', () => {
        const error = new Error("internal server error ");
        const result: APIGatewayProxyStructuredResultV2 | any = common.createErrorResponseForInternalServerErrors(error);
        strictEqual(result.statusCode, 500);
        strictEqual(result.body, JSON.stringify({ error }));
    });


});


