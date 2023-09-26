import { handler } from "../../src";
import { describe, it } from "mocha";
import Sinon from "sinon";
import AddressLookupService from "../../src/service/AddressLookupService";
import { internalServerErrorResponse } from "../../src/util/constants";
import { strictEqual } from "assert";

describe('Lambda handler', () => {
    const sandbox = Sinon.createSandbox();
    afterEach(() => {
        sandbox.restore()
    })
    const expectedSuccessfullBodyOutcome = {
        statusCode: 200,
        body: '{"suburb":"BATHURST","location":{"longitude":149.56705027262,"latitude":-33.4296842928957},"stateElectoralDistrictName":"BATHURST"}'
    }

    const expectedInvalidUserRequestErrorResponse = {
        error: 'Please enter valid address in Query Param.'
    }
    const expetectInternalServerErrorResponse = {
        error: internalServerErrorResponse
    }

    const validAddress = "2 francis road artarmon";
    it("should take valid address string as input argument from Query Parameters of API request to produce a successful response", async () => {
        sandbox.stub(AddressLookupService, 'lookupAddress',).resolves(expectedSuccessfullBodyOutcome);
        const result = await handler({ queryStringParameters: { address: validAddress } } as any);
        strictEqual(result.statusCode, 200);
        strictEqual(result.body, expectedSuccessfullBodyOutcome.body);
    });

    it("should produce a Error response for null address", async () => {
        sandbox.stub(AddressLookupService, 'lookupAddress',).resolves(expectedSuccessfullBodyOutcome);
        const result = await handler({ queryStringParameters: { address: null } } as any);
        strictEqual(result.statusCode, 400);
        strictEqual(result.body, JSON.stringify(expectedInvalidUserRequestErrorResponse));
    });

    it("should produce a Error response for Internal Server Eror by rejected lookup address ", async () => {
        sandbox.stub(AddressLookupService, 'lookupAddress',).rejects(new Error());
        const result = await handler({ queryStringParameters: { address: validAddress } } as any);
        strictEqual(result.statusCode, 500);
        strictEqual(result.body, JSON.stringify(expetectInternalServerErrorResponse));
    });
})