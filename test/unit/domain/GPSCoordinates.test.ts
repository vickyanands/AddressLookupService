import { createUrlForFindingCorrdinates } from '../../../src/domain/GPSCoordinates';
import { describe, it } from "mocha";
import { strictEqual } from "assert";
import Sinon from "sinon";
import axios, { AxiosResponse } from 'axios';
import GpsCoordinate from "../../../src/domain/GPSCoordinates";


describe('should createUrlForFindingCoordinates ', () => {
    it('should create a valid URL with the provided address', () => {
        const address = '2 francis road artarmon';
        const expectedUrl = "https://portal.spatial.nsw.gov.au/server/rest/services/NSW_Geocoded_Addressing_Theme/FeatureServer/1/query?outFields=*&f=geojson&where=address%3D%272+FRANCIS+ROAD+ARTARMON%27";
        const result = createUrlForFindingCorrdinates(address);
        strictEqual(result.toString(), (expectedUrl.toString()));
    });

    it('should handle special characters in the address while createUrlForFindingCoordinates ', () => {
        const address = '16-20 warialda street kogarah';
        const expectedUrl = 'https://portal.spatial.nsw.gov.au/server/rest/services/NSW_Geocoded_Addressing_Theme/FeatureServer/1/query?outFields=*&f=geojson&where=address%3D%2716-20+WARIALDA+STREET+KOGARAH%27';
        const result = createUrlForFindingCorrdinates(address);
        strictEqual(result.toString(), (expectedUrl.toString()));
    });
});

describe('getGPSCoordinatesForAddress', () => {
    const sandbox = Sinon.createSandbox();
    afterEach(() => {
        sandbox.restore()
    })
    const gpsCoordinatesSampleData =
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

    const customResponse = {
        data: gpsCoordinatesSampleData,
        status: 200,
        statusText: 'OK',
        headers: { 'Content-Type': 'application/json' },
        config: {},
    } as AxiosResponse<any, any>;

    it('should fetch GPS coordinates for a valid address', async () => {
        const address = '346 PANORAMA AVENUE BATHURST';
        sandbox.stub(axios, 'get').resolves(customResponse);
        const { gpsCooridnatesResonseObject } = await GpsCoordinate.getGPSCoordinatesForAddress(address);
        console.log(gpsCoordinatesSampleData, gpsCooridnatesResonseObject)
        strictEqual(gpsCoordinatesSampleData, gpsCooridnatesResonseObject);
    });

    it('should handle errors gracefully', async () => {
        const address = 'Invalid Address';
        sandbox.stub(axios, 'get').rejects(new Error('Service Error'));
        try {
            await GpsCoordinate.getGPSCoordinatesForAddress(address);
        } catch (error) {
            strictEqual('Service Error', error.message);
        }
    });
});