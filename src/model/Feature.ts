export interface Feature {
    type: "Feature" | string,
    id: number
    geometry: {
        type: 'Point' | string,
        coordinates: Array<number>
    },
    properties: any
}
