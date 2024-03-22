import { ViewModel } from "crisper.ko/annotations/ViewModel";
import { IObservable } from "crisper.ko/interceptors/observable/IObservable";
import { Observable } from "crisper.ko/interceptors/observable/Observable";
import { Required } from "crisper.di/annotations/Required";
import { REObjectRequest } from "../models/entities/REObjectRequest";
import { IREObject } from "../models/entities/interfaces/IREObject";
import { PostConstruct } from "crisper.di/annotations/PostConstruct";
import { Interface } from "crisper.std/Interface";
import { IREObjectsService } from "../models/services/interfaces/IREObjectsService";
import { Throws } from "crisper.ko/interceptors/exceptionshandler/Throws";
import { Catch } from "crisper.ko/interceptors/exceptionshandler/Catch";
import { Exception } from "crisper.std/Exception";
import { IExceptionsHandler } from "crisper.ko/interceptors/exceptionshandler/IExceptionsHandler";
import { RequestException } from "crisper.ko/asyncrequest/exceptions/RequestException";
import { AbortException } from "crisper.ko/asyncrequest/exceptions/AbortException";
import { User } from "../models/entities/User";

@ViewModel("objects-list")
export class ObjectsList implements IObservable, IExceptionsHandler {
    @Observable() public active: boolean = false;
    @Observable() public count: number = 0;
    @Observable() public mode: string = "LIST";
    public refreshEventEmitter: KnockoutObservable<any> = ko.observable().extend({ notify: "always" });
    @Required("reObjectRequest")
    public reObjectRequest: REObjectRequest;
    @Required("reObjectsCollection")
    public reObjectsCollection: KnockoutObservableArray<IREObject>;
    @Required("profile")
    public profile: User;
    @Required("favoritesCollection")
    private favoritesCollection: KnockoutObservableArray<IREObject>;
    @Required(new Interface<IREObjectsService>("IREObjectsService"))
    private reObjectService: IREObjectsService;
    private page: number = 0;
    private size: number = 15;
    
    @Observable()
    public favoritesIds(): Array<string> {
        return this.favoritesCollection().map(object => object.id);
    }
    
    @PostConstruct()
    public init(): void {
        this.reObjectRequest.observe(this.refresh.bind(this), "polygon");
        this.getObservableFor("mode").subscribe(() => this.refreshEventEmitter(true));
    }
    
    public modifyFavorites(object: IREObject): boolean {
        const id: number = this.favoritesIds().indexOf(object.id);
        if (id != -1) this.favoritesCollection.splice(id, 1);
        else this.favoritesCollection.push(object);
        return false;
    }
    
    public refresh(): Promise<void> {
        this.page = 0;
        this.count = 0;
        this.reObjectsCollection([]);
        return this.search();
    }
    
    @Throws()
    public async search(): Promise<void> {
        this.active = true;
        var pages: number;
        [this.count, pages] = await this.reObjectService.get(this.reObjectRequest, this.page, this.size,
                                                             this.reObjectsCollection);
        if (this.page != pages) this.page++;
        this.active = false;
        this.refreshEventEmitter(true);
    }
    
    @Catch([RequestException])
    private catchInvalid(exception: RequestException): boolean {
        if (exception.getStatus() != 400) return false;
        this.active = false;
        return true;
    }
    
    @Catch([AbortException])
    private catchRequestCancelation(): boolean {
        this.active = false;
        return true;
    }
    
    @Catch([Exception])
    private hideLoader(): boolean {
        this.active = false;
        return false;
    }
    
    public getObservableFor<T extends KnockoutSubscribable<any>>(key: string): T { return null; }
    
    implementsIObservable() {}
    implementsIExceptionsHandler() {}
}