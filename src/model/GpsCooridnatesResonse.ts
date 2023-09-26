import { Feature } from "./Feature";

export interface GpsCooridnatesResonse {
    type: "FeatureCollection" | string;
    features: Array<Feature>;
}
