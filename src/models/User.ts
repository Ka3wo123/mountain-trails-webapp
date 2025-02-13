import { Peak } from "./Peak";

export interface User {
    _id: string;
    name: string;
    surname: string;
    nick: string;
    password: string;    
    peaksAchieved: Peak[];
    createdAt: string;
    updatedAt: string;
}
