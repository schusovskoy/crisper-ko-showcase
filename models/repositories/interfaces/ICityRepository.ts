export interface ICityRepository {
    search(city: string): Promise<Array<string>>;
    searchRegions(city: string): Promise<Array<string>>;
    searchFilterRegions(city: string): Promise<Array<string>>;
    getCoordinate(fullAddress: string): Promise<{ type: string, coordinates: Array<number> }>;
    getLocation(): Promise<Array<number>>;
    getCityName(coordinate: Array<number>): Promise<string>;
    implementsICityRepository?();
}