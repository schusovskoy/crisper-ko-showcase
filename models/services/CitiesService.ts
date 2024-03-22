import { ICitiesService } from "./interfaces/ICitiesService";
import { Required } from "crisper.di/annotations/Required";
import { Interface } from "crisper.std/Interface";
import { ICityRepository } from "../repositories/interfaces/ICityRepository";

export class CitiesService implements ICitiesService {
    @Required(new Interface<ICityRepository>("ICityRepository"))
    private cityRepository: ICityRepository;
    
    public searchCity(city: string): Promise<Array<string>> {
        return this.cityRepository.search(city);
    }
    
    public searchRegions(city: string, isFilter?: boolean): Promise<Array<string>> {
        return isFilter ? this.cityRepository.searchFilterRegions(city) : this.cityRepository.searchRegions(city);
    }
    
    public getCoordinate(fullAddress: string): Promise<{ type: string; coordinates: Array<number> }> {
        return this.cityRepository.getCoordinate(fullAddress);
    }
    
    public async getCurrentCityName(): Promise<string> {
        const coordinates = await this.cityRepository.getLocation();
        return await this.cityRepository.getCityName(coordinates);
    }
    
    implementsICitiesService() {}
}