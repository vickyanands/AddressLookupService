import { LatLong } from "./LatLong";

export interface Output {
    suburb?: string;
    location: LatLong;
    stateElectoralDistrictName?: string
}