import { ViewModel } from "crisper.ko/annotations/ViewModel";
import { IObservable } from "crisper.ko/interceptors/observable/IObservable";
import { Observable } from "crisper.ko/interceptors/observable/Observable";
import { Required } from "crisper.di/annotations/Required";
import { IREObjectRequest } from "../models/entities/interfaces/IREObjectRequest";
import { Interface } from "crisper.std/Interface";
import { IREObjectsService } from "../models/services/interfaces/IREObjectsService";
import { User } from "../models/entities/User";
import { Throws } from "crisper.ko/interceptors/exceptionshandler/Throws";
import { IExceptionsHandler } from "crisper.ko/interceptors/exceptionshandler/IExceptionsHandler";
import { Catch } from "crisper.ko/interceptors/exceptionshandler/Catch";
import { RequestException } from "crisper.ko/asyncrequest/exceptions/RequestException";
import { Exception } from "crisper.std/Exception";
import { PostConstruct } from "crisper.di/annotations/PostConstruct";
import { Alert } from "./Alert";

@ViewModel("requests-list")
export class RequestsList implements IObservable, IExceptionsHandler {
    @Observable() public isShown: boolean = false;
    @Observable() public active: boolean = false;
    @Required("requestsCollection")
    public requestsCollection: KnockoutObservableArray<IREObjectRequest>;
    @Required("profile")
    private profile: User;
    @Required(new Interface<IREObjectsService>("IREObjectsService"))
    private reObjectsService: IREObjectsService;
    @Required()
    private alert: Alert;
    
    @PostConstruct()
    public init(): void {
        this.getObservableFor("isShown")
            .subscribe(isShown => isShown && this.refresh());
    }
    
    public show(): void { this.isShown = true; }
    
    public hide(): void { this.isShown = false; }
    
    @Throws()
    private async refresh(): Promise<void> {
        this.active = true;
        this.requestsCollection(await this.reObjectsService.getRequests(this.profile));
        this.active = false;
    }
    
    @Throws()
    public async remove(request: IREObjectRequest): Promise<void> {
        this.alert.header = "Удаление запроса";
        this.alert.showCancel = true;
        this.alert.text = "Вы действительно хотите удалить запрос?";
        if (await this.alert.show()) {
            this.active = true;
            await this.reObjectsService.removeRequest(request.id, this.profile);
            this.active = false;
            this.requestsCollection.splice(this.requestsCollection.indexOf(request), 1);
        }
    }
    
    @Catch([RequestException])
    private anauthorized(ex: RequestException): boolean {
        this.requestsCollection([]);
        this.active = false;
        return ex.getStatus() == 400;
    }
    
    @Catch([Exception])
    private hideLoader(): boolean {
        this.active = false;
        return false;
    }
    
    public getObservableFor<T extends KnockoutSubscribable<any>>(key: string): T {
        return null;
    }
    
    implementsIObservable() {}
    implementsIExceptionsHandler() {}
}