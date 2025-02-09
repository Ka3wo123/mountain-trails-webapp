export interface Peak {
    _id: string;  // MongoDB ObjectId stored as a string
    type: string;
    id: number;
    lat: number;
    lon: number;
    tags: {
        [key: string]: string; // Allows flexible tagging
        name: string;
        ele: string; // Elevation
    };
}
