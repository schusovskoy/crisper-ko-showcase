import { IFileObject } from "./IFileObject";

export interface IREObject {
    id?: string;
    coordinate?: { type: string, coordinates: Array<number> };
    city?: string;
    region?: string;
    address?: string;
    operation?: string;
    object?: string;
    sqmain?: string;
    sqliving?: string;
    sqkitchen?: string;
    sqarea?: string;
    cost?: string;
    floor?: string;
    floors?: string;
    rooms?: string;
    type?: string;
    industrialType?: string;
    hypothec?: boolean;
    lift?: boolean;
    parking?: boolean;
    internet?: boolean;
    furniture?: boolean;
    appliances?: boolean;
    water?: boolean;
    gas?: boolean;
    electricity?: boolean;
    canalization?: boolean;
    decor?: boolean;
    description?: string;
    files?: Array<IFileObject>;
    fio?: string;
    phone?: string;
    addDate?: string;
    relatedObjects?: Array<IREObject>;
    implementsIREObject?();
}