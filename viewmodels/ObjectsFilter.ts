import { ViewModel } from "crisper.ko/annotations/ViewModel";
import { Required } from "crisper.di/annotations/Required";
import { REObjectRequest } from "../models/entities/REObjectRequest";
import { Interface } from "crisper.std/Interface";
import { ICitiesService } from "../models/services/interfaces/ICitiesService";
import { Observable } from "crisper.ko/interceptors/observable/Observable";
import { IObservable } from "crisper.ko/interceptors/observable/IObservable";
import { PostConstruct } from "crisper.di/annotations/PostConstruct";
import { IExceptionsHandler } from "crisper.ko/interceptors/exceptionshandler/IExceptionsHandler";
import { Throws } from "crisper.ko/interceptors/exceptionshandler/Throws";
import { IREObjectsService } from "../models/services/interfaces/IREObjectsService";
import { Catch } from "crisper.ko/interceptors/exceptionshandler/Catch";
import { RequestException } from "crisper.ko/asyncrequest/exceptions/RequestException";
import { Alert } from "./Alert";
import { Exception } from "crisper.std/Exception";

//noinspection JSAnnotator
@ViewModel("objects-filter")
export class ObjectsFilter implements IObservable, IExceptionsHandler {
    @Observable() public regions: Array<string> = [];
    @Observable() public active: boolean = false;
    @Required("reObjectRequest")
    public reObjectRequest: REObjectRequest;
    @Required("profile")
    public profile;
    @Required(new Interface<ICitiesService>("ICitiesService"))
    public citiesService: ICitiesService;
    @Required(new Interface<IREObjectsService>("IREObjectsService"))
    private reObjectsService: IREObjectsService;
    @Required()
    private alert: Alert;
    
    @PostConstruct()
    public init(): void {
        this.reObjectRequest.getObservableFor("city")
            .subscribe(this.loadRegions.bind(this));
    }
    
    public clear(): void {
        this.reObjectRequest.clear();
    }
    
    @Throws()
    public async save(): Promise<void> {
        if (this.active) return;
        
        this.active = true;
        await this.reObjectsService.saveRequest(this.reObjectRequest, this.profile);
        this.active = false;
        this.alert.header = "Подписка";
        this.alert.showCancel = false;
        this.alert.text = "Подписка успешно создана";
        this.alert.show();
    }
    
    private async loadRegions(city: string): Promise<void> {
        try {
            this.regions = await this.citiesService.searchRegions(city, true);
        } catch (ex) {
            this.regions = [];
        }
        this.reObjectRequest.region = "";
    }
    
    @Catch([RequestException])
    private catchMissingCity(ex: RequestException): boolean {
        if (ex.getStatus() != 400) return false;
        this.active = false;
        this.alert.showCancel = false;
        this.alert.header = "Ошибка";
        this.alert.text = "Поле город должо быть заполнено";
        this.alert.show();
        return true;
    }
    
    @Catch([Exception])
    private catchException(): boolean {
        this.active = false;
        return false;
    }
    
    implementsIObservable() {}
    implementsIExceptionsHandler() {}
}