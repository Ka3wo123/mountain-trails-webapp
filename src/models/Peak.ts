export interface Peak {
    _id: string;
    type: string;
    id: number;
    lat: number;
    lon: number;
    tags: {
        [key: string]: string;
        name: string;
        ele: string;
    };
}
