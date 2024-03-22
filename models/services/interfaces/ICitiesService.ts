export interface ICitiesService {
    searchCity(city: string): Promise<Array<string>>;
    searchRegions(city: string, isFilter?: boolean): Promise<Array<string>>;
    getCoordinate(fullAddress: string): Promise<{ type: string, coordinates: Array<number> }>;
    getCurrentCityName(): Promise<string>;
    implementsICitiesService?();
}