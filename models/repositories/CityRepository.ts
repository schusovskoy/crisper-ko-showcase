import { ICityRepository } from "./interfaces/ICityRepository";
import { AsyncRequest } from "crisper.ko/asyncrequest/AsyncRequest";

export class CityRepository implements ICityRepository {
    private cityRequest: AsyncRequest = new AsyncRequest();
    private regionRequest: AsyncRequest = new AsyncRequest();
    private filterRegionRequest: AsyncRequest = new AsyncRequest();
    private yaRequest: AsyncRequest = new AsyncRequest();
    
    public async search(city: string): Promise<Array<string>> {
        this.cityRequest.abort();
        this.cityRequest.open("GET", `/city/${city}`);
        this.cityRequest.timeout = 5000;
        const result: string = await this.cityRequest.send();
        return JSON.parse(result).map(city => city.name);
    }
    
    public async searchRegions(city: string): Promise<Array<string>> {
        this.regionRequest.abort();
        this.regionRequest.open("GET", `/city/${city}`);
        this.regionRequest.timeout = 5000;
        const result: string = await this.regionRequest.send();
        return JSON.parse(result)[0].regions.map(region => region.name);
    }
    
    public async searchFilterRegions(city: string): Promise<Array<string>> {
        this.filterRegionRequest.abort();
        this.filterRegionRequest.open("GET", `/city/${city}`);
        this.filterRegionRequest.timeout = 5000;
        const result: string = await this.filterRegionRequest.send();
        return JSON.parse(result)[0].regions.map(region => region.name);
    }
    
    public async getCoordinate(fullAddress: string): Promise<{ type: string; coordinates: Array<number> }> {
        this.yaRequest.abort();
        this.yaRequest.open("GET", `https://geocode-maps.yandex.ru/1.x/?format=json&geocode=${fullAddress}`);
        this.yaRequest.timeout = 5000;
        const result: string = await this.yaRequest.send();
        const coordinates: Array<string> = JSON.parse(result)
            .response.GeoObjectCollection
            .featureMember[0]
            .GeoObject.Point.pos.split(" ");
        return {
            type: "Point",
            coordinates: [parseFloat(coordinates[1]), parseFloat(coordinates[0])]
        };
    }
    
    public getLocation(): Promise<Array<number>> {
        return new Promise((resolve: (data: Array<number>) => void) => {
            navigator.geolocation.getCurrentPosition(result => {
                resolve([result.coords.latitude, result.coords.longitude]);
            }, err => {
                resolve([45.0534624, 39.0759726]);
            });
        });
    }
    
    public async getCityName(coordinate: Array<number>): Promise<string> {
        this.yaRequest.abort();
        this.yaRequest.open("GET", `https://geocode-maps.yandex.ru/1.x/?format=json&geocode=${coordinate[1]} ${coordinate[0]}`);
        this.yaRequest.timeout = 5000;
        const result = JSON.parse(await this.yaRequest.send());
        return result.response.GeoObjectCollection
            .featureMember.find(object => object.GeoObject.metaDataProperty.GeocoderMetaData.kind == "locality")
            .GeoObject.name;
    }
    
    implementsICityRepository() {}
}