import { ViewModel } from "crisper.ko/annotations/ViewModel";
import { Required } from "crisper.di/annotations/Required";
import { REObject } from "../models/entities/REObject";
import { Interface } from "crisper.std/Interface";
import { ICitiesService } from "../models/services/interfaces/ICitiesService";
import { PostConstruct } from "crisper.di/annotations/PostConstruct";
import { IREObject } from "../models/entities/interfaces/IREObject";
import { IREObjectsService } from "../models/services/interfaces/IREObjectsService";
import { REObjectRequest } from "../models/entities/REObjectRequest";
import { Throws } from "crisper.ko/interceptors/exceptionshandler/Throws";
import { IExceptionsHandler } from "crisper.ko/interceptors/exceptionshandler/IExceptionsHandler";
import { Catch } from "crisper.ko/interceptors/exceptionshandler/Catch";
import { Exception } from "crisper.std/Exception";
import { IObservable } from "crisper.ko/interceptors/observable/IObservable";
import { Observable } from "crisper.ko/interceptors/observable/Observable";
import { Navigation } from "./Navigation";

@ViewModel("map")
export class Map implements IObservable, IExceptionsHandler {
    @Observable() public coordinate: { coordinates: Array<number> } = { coordinates: [45.0534624, 39.0759726] };
    @Observable() public zoom: number = 11;
    @Required("reObject")
    public reObject: REObject;
    @Required("selectedObject")
    public selectedObject: REObject;
    @Required("reObjectsMapCollection")
    public reObjectsMapCollection: KnockoutObservableArray<IREObject>;
    @Required("myObjectsCollection")
    public myObjectsCollection: KnockoutObservableArray<IREObject>;
    @Required("favoritesCollection")
    public favoritesCollection: KnockoutObservableArray<IREObject>;
    @Required("reObjectRequest")
    private reObjectRequest: REObjectRequest;
    @Required(new Interface<ICitiesService>("ICitiesService"))
    private citiesService: ICitiesService;
    @Required(new Interface<IREObjectsService>("IREObjectsService"))
    private reObjectsService: IREObjectsService;
    @Required()
    private navigation: Navigation;
    
    @Observable()
    public layerToShow(): string {
        if (this.navigation.page == "ADD_OBJECT" ||
            this.navigation.page == "EDIT" ||
            this.navigation.page == "OBJECT_VIEWER" ||
            this.navigation.page == "MY_OBJECT_VIEWER" ||
            this.navigation.page == "FAV_OBJECT") return "marker";
        return "markers";
    }
    
    @Observable()
    public markerPanTo(): { coordinates: Array<number> } | KnockoutObservable<{ coordinates: Array<number> }> {
        if (this.navigation.page == "ADD_OBJECT" ||
            this.navigation.page == "EDIT") return this.reObject.coordinate;
        if (this.navigation.page == "OBJECT_VIEWER" ||
            this.navigation.page == "MY_OBJECT_VIEWER" ||
            this.navigation.page == "FAV_OBJECT") return this.selectedObject.coordinate;
        return this.getObservableFor<KnockoutObservable<{ coordinates: Array<number> }>>("coordinate");
    }
    
    @Observable()
    public markersCollection(): KnockoutObservableArray<IREObject> {
        if (this.navigation.page == "FAVORITES") return this.favoritesCollection;
        if (this.navigation.page == "MY_OBJECTS") return this.myObjectsCollection;
        return this.reObjectsMapCollection;
    }
    
    @Observable()
    public getZoom(): number | KnockoutObservable<number> {
        if (this.navigation.page == "ADD_OBJECT" ||
            this.navigation.page == "EDIT" ||
            this.navigation.page == "OBJECT_VIEWER" ||
            this.navigation.page == "MY_OBJECT_VIEWER" ||
            this.navigation.page == "FAV_OBJECT") return 16;
        return this.getObservableFor<KnockoutObservable<number>>("zoom");
    }
    
    @PostConstruct()
    public init(): void {
        this.reObject.getObservableFor("fullAddress").subscribe(this.updateCoordinate.bind(this));
        this.reObjectRequest.observe(this.updateMarkers.bind(this), "sort");
        this.reObjectRequest.getObservableFor("city").subscribe(this.updateCityCoordinate.bind(this));
        this.getCurrentCity();
    }
    
    @Throws()
    public async getCurrentCity(): Promise<void> {
        const name = await this.citiesService.getCurrentCityName();
        this.reObjectRequest.city = name;
        this.reObject.city = name;
    }
    
    @Throws()
    public async updateCityCoordinate(): Promise<void> {
        this.coordinate = await this.citiesService.getCoordinate(this.reObjectRequest.city);
    }
    
    @Throws()
    public async updateCoordinate(): Promise<void> {
        this.reObject.coordinate = await this.citiesService.getCoordinate(this.reObject.fullAddress());
    }
    
    @Throws()
    public async updateMarkers(): Promise<void> {
        this.reObjectsMapCollection(await this.reObjectsService.getMarkers(this.reObjectRequest));
    }
    
    @Catch([Exception])
    private catchExceptions(): boolean {
        return true;
    }
    
    public getObservableFor<T extends KnockoutSubscribable<any>>(key: string): T {
        return null;
    }
    
    implementsIObservable() {}
    implementsIExceptionsHandler() {}
}