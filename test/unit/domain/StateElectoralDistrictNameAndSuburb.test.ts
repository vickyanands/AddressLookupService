import { describe, it } from "mocha";
import { strictEqual } from "assert";
import Sinon from "sinon";
import axios, { AxiosResponse } from 'axios';
import StateElectoralDistrictNameAndSuburb, { createUrlForFindingStateElectoralDistrictOrSuburb } from '../../../src/domain/StateElectoralDistrictNameAndSuburb';


describe('should createUrlForFindingStateElectoralDistrictOrSuburb ', () => {

    const coordinates = [112, 2223]

    it('should create a valid URL for fidning susburb with the provided coordinates ', () => {
        const expectedUrl = "https://portal.spatial.nsw.gov.au/server/rest/services/NSW_Administrative_Boundaries_Theme/FeatureServer/2/query?geometryType=esriGeometryPoint&inSR=4326&spatialRel=esriSpatialRelIntersects&outFields=*&returnGeometry=false&f=geoJSON&geometry=112%2C2223";
        const result = createUrlForFindingStateElectoralDistrictOrSuburb(coordinates, "Suburb");
        strictEqual(result.toString(), (expectedUrl.toString()));
    });
    it('should create a valid URL for finding State Electoral District Name with the provided coordinates ', () => {
        const expectedUrl = "https://portal.spatial.nsw.gov.au/server/rest/services/NSW_Administrative_Boundaries_Theme/FeatureServer/4/query?geometryType=esriGeometryPoint&inSR=4326&spatialRel=esriSpatialRelIntersects&outFields=*&returnGeometry=false&f=geoJSON&geometry=112%2C2223";
        const result = createUrlForFindingStateElectoralDistrictOrSuburb(coordinates, "StateElectoralDistrict");
        strictEqual(result.toString(), (expectedUrl.toString()));
    });
});


describe('fetchStateEleactoralDisctrictAndSuburbName', () => {
    const sandbox = Sinon.createSandbox();
    afterEach(() => {
        sandbox.restore()
    })
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
    const coordinates = [112, 2223]

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

    it('should fetch is called twice for district name and suburb name for given coordinates', async () => {
        const axiosStub = sandbox.stub(axios, 'get').resolves(customResponseDistrictName);
        const promiseAllStub = sandbox.stub(Promise, 'all').resolves([customResponseDistrictName, customResponseSuburbName])
        const [districtnameData, suburbNameData] = await StateElectoralDistrictNameAndSuburb.fetchStateEleactoralDisctrictAndSuburbName(coordinates);
        strictEqual(axiosStub.calledTwice, true);
        strictEqual(promiseAllStub.calledOnce, true);
        strictEqual(suburbNameData.data.features[0].properties.suburbname, suburbnameSampleData.features[0].properties.suburbname)
        strictEqual(districtnameData.data.features[0].properties.districtname, districtnameSampleData.features[0].properties.districtname)
    });

    it('should handle errors gracefully', async () => {
        sandbox.stub(axios, 'get').rejects(new Error('Service Error'));
        try {
            await StateElectoralDistrictNameAndSuburb.fetchStateEleactoralDisctrictAndSuburbName(coordinates);
        } catch (error) {
            strictEqual('Service Error', error.message);
        }
    });
});