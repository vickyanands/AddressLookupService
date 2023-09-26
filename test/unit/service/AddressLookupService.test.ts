import { describe, it } from "mocha";
import { strictEqual } from "assert";
import Sinon from "sinon";
import { AxiosResponse } from 'axios';
import AddressLookupService from "../../../src/service/AddressLookupService";
import { GpsCooridnatesResonse } from "../../../src/model/GpsCooridnatesResonse";
import GpsCoordinate from "../../../src/domain/GPSCoordinates";
import StateElectoralDistrictNameAndSuburb from "../../../src/domain/StateElectoralDistrictNameAndSuburb";


describe("lookupAddress", async () => {
    const validAddress = "2 francis road artarmon";
    const gpsCoordinatesSampleData: GpsCooridnatesResonse =
    {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "id": 3973380,
                "geometry": {
                    "type": "Point",
                    "coordinates": [149.56705027262, -33.4296842928957, 0]
                },
                "properties": {
                    "rid": 3973380,
                    "createdate": 1510848630000,
                    "gurasid": 80490381,
                    "principaladdresssiteoid": 3725744,
                    "addressstringoid": 7020427,
                    "addresspointtype": 3,
                    "addresspointuncertainty": null,
                    "containment": 1,
                    "startdate": 1510848644000,
                    "enddate": 32503680000000,
                    "lastupdate": 1510848692756,
                    "msoid": 6306850,
                    "centroidid": null,
                    "shapeuuid": "e0e74564-61fa-37a6-ad2d-2490c52eb326",
                    "changetype": "M",
                    "processstate": null,
                    "urbanity": "S",
                    "address": "346 PANORAMA AVENUE BATHURST",
                    "housenumber": "346"
                }
            }
        ]
    }

    const customGpsCoordinatesResponse = {
        data: gpsCoordinatesSampleData,
        status: 200,
        statusText: 'OK',
        headers: { 'Content-Type': 'application/json' },
        config: {},
    } as AxiosResponse<any, any>;

    const sandbox = Sinon.createSandbox();
    afterEach(() => {
        sandbox.restore()
    });
    const districtnameSampleData =
    {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "id": 6195,
                "geometry": null,
                "properties": {
                    "rid": 6195,
                    "cadid": 108028729,
                    "createdate": 818467200000,
                    "modifieddate": 1695045569000,
                    "districtname": "BATHURST",
                    "startdate": 1695046338000,
                    "enddate": 32503680000000,
                    "lastupdate": 1695046737194,
                    "msoid": 2,
                    "centroidid": null,
                    "shapeuuid": "4745fa2e-f377-38db-b384-6bc4e1134d65",
                    "changetype": "M",
                    "processstate": null,
                    "urbanity": "R",
                    "Shape__Length": 1362550.6378849389,
                    "Shape__Area": 23472272725.175556
                }
            }
        ]
    }
    const suburbnameSampleData =
    {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "id": 7133,
                "geometry": null,
                "properties": {
                    "rid": 7133,
                    "cadid": 108032366,
                    "createdate": 806889600000,
                    "modifieddate": 1490702307000,
                    "suburbname": "BATHURST",
                    "postcode": 2795,
                    "state": 2,
                    "startdate": 1490702331000,
                    "enddate": 32503680000000,
                    "lastupdate": 1490702868539,
                    "msoid": 2832,
                    "centroidid": null,
                    "shapeuuid": "146b22bd-d9ed-3059-9743-e6fc933df347",
                    "changetype": "M",
                    "processstate": null,
                    "urbanity": "U",
                    "Shape__Length": 13679.501791143572,
                    "Shape__Area": 8470823.151855787
                }
            }
        ]
    }

    const customResponseDistrictName = {
        data: districtnameSampleData,
        status: 200,
        statusText: 'OK',
        headers: { 'Content-Type': 'application/json' },
        config: {},
    } as AxiosResponse<any, any>;
    const customResponseSuburbName = {
        data: suburbnameSampleData,
        status: 200,
        statusText: 'OK',
        headers: { 'Content-Type': 'application/json' },
        config: {},
    } as AxiosResponse<any, any>;

    const expectedSuccessfulBodyOutcome = {
        suburb: 'BATHURST',
        location: { longitude: 149.56705027262, latitude: -33.4296842928957 },
        stateElectoralDistrictName: 'BATHURST'
    }
    const expectedInternaServerErrorResponse = {
        error: 'Internal Server Error while looking up address. Please try after some time'
    }
    const expectedInvalidUserRequestErrorResponse = {
        error: 'Address not found. Please enter valid address.'
    }

    it("should take valid address string as input argument to produce a successful response", async () => {
        sandbox.stub(GpsCoordinate, 'getGPSCoordinatesForAddress').resolves({ gpsCooridnatesResonseObject: gpsCoordinatesSampleData });
        sandbox.stub(StateElectoralDistrictNameAndSuburb, 'fetchStateEleactoralDisctrictAndSuburbName').resolves([customResponseDistrictName, customResponseSuburbName])
        const result = await AddressLookupService.lookupAddress(validAddress);
        console.log(result);
        strictEqual(result.statusCode, 200);
        strictEqual(result.body, JSON.stringify(expectedSuccessfulBodyOutcome));
    });

    it("should take valid address should return as internal server error with address not found if GPS coordinate service fails", async () => {
        sandbox.stub(GpsCoordinate, 'getGPSCoordinatesForAddress').rejects(new Error());
        sandbox.stub(StateElectoralDistrictNameAndSuburb, 'fetchStateEleactoralDisctrictAndSuburbName').resolves([customResponseDistrictName, customResponseSuburbName])
        const result = await AddressLookupService.lookupAddress(validAddress);
        strictEqual(result.statusCode, 500);
        strictEqual(result.body, JSON.stringify(expectedInternaServerErrorResponse));
    });

    it("should take valid address should return as internal server error with address not found if state electoral District name and suburb name service fails", async () => {
        sandbox.stub(GpsCoordinate, 'getGPSCoordinatesForAddress').resolves({ gpsCooridnatesResonseObject: gpsCoordinatesSampleData });
        sandbox.stub(StateElectoralDistrictNameAndSuburb, 'fetchStateEleactoralDisctrictAndSuburbName').rejects(new Error());
        const result = await AddressLookupService.lookupAddress(validAddress);
        strictEqual(result.statusCode, 500);
        strictEqual(result.body, JSON.stringify(expectedInternaServerErrorResponse));
    });

    it("should take invalid address should return as address not found error", async () => {
        sandbox.stub(GpsCoordinate, 'getGPSCoordinatesForAddress').resolves({ gpsCooridnatesResonseObject: {} });
        sandbox.stub(StateElectoralDistrictNameAndSuburb, 'fetchStateEleactoralDisctrictAndSuburbName').resolves([customResponseDistrictName, customResponseSuburbName])
        const result = await AddressLookupService.lookupAddress(validAddress);
        strictEqual(result.statusCode, 400);
        strictEqual(result.body, JSON.stringify(expectedInvalidUserRequestErrorResponse));
    });
});