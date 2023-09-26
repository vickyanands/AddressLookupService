import { equal, strictEqual } from 'assert';
import axios from 'axios';
import { describe, it } from "mocha";
const expectedOutCome = {
    suburb: 'KOGARAH',
    location: { longitude: 151.13320558250874, latitude: -33.95710984847756 },
    stateElectoralDistrictName: 'KOGARAH'
};
const urlWithValidAddress = "https://ynfvhoazmf.execute-api.ap-southeast-2.amazonaws.com/dev/address-lookup?address=16-20%20warialda%20street%20kogarah";

const urlWithInvalidAddress = "https://ynfvhoazmf.execute-api.ap-southeast-2.amazonaws.com/dev/address-lookup?address=16-20%20warialda%20street%20krah";

const errorResponsseForInvalidAddressRequest = { error: 'Address not found. Please enter valid address.' }

describe("E2E testing for address lookup service", () => {
    it("should return expected correct subburb name, district name and location for valid known address", async () => {
        const response = await axios.get(urlWithValidAddress);
        strictEqual(response.data.suburb, expectedOutCome.suburb);
        strictEqual(response.data.stateElectoralDistrictName, expectedOutCome.stateElectoralDistrictName);
        strictEqual(response.data.location.latitude, expectedOutCome.location.latitude);
        strictEqual(response.data.location.longitude, expectedOutCome.location.longitude);
    });
    it("should return invalid Address for invalid address input", async () => {
        try {
            const response = await axios.get(urlWithInvalidAddress);
        }
        catch (err) {
            strictEqual(err.response.data.error, errorResponsseForInvalidAddressRequest.error);
        }
    });
});