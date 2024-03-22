export interface IREObjectRequest {
    id?: string;
    city?: string;
    region?: string;
    operation?: string;
    object?: string;
    sqmainFrom?: string;
    sqlivingFrom?: string;
    sqkitchenFrom?: string;
    costFrom?: string;
    costTo?: string;
    floorFrom?: string;
    floorTo?: string;
    roomsFrom?: string;
    type?: string;
    sqareaFrom?: string;
    industrialType?: string;
    internet?: boolean;
    decor?: boolean;
    hypothec?: boolean;
    furniture?: boolean;
    appliances?: boolean;
    lift?: boolean;
    gas?: boolean;
    canalization?: boolean;
    water?: boolean;
    electricity?: boolean;
    parking?: boolean;
    sort?: string;
    polygon?: { type: string, coordinates: Array<Array<Array<number>>> };
    implementsIREObjectRequest?();
}