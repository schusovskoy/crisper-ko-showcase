import { ViewModel } from "crisper.ko/annotations/ViewModel";
import { IObservable } from "crisper.ko/interceptors/observable/IObservable";
import { Observable } from "crisper.ko/interceptors/observable/Observable";
import { Required } from "crisper.di/annotations/Required";
import { IREObject } from "../models/entities/interfaces/IREObject";
import { PostConstruct } from "crisper.di/annotations/PostConstruct";
import { Interface } from "crisper.std/Interface";
import { IREObjectsService } from "../models/services/interfaces/IREObjectsService";
import { Throws } from "crisper.ko/interceptors/exceptionshandler/Throws";
import { Catch } from "crisper.ko/interceptors/exceptionshandler/Catch";
import { Exception } from "crisper.std/Exception";
import { IExceptionsHandler } from "crisper.ko/interceptors/exceptionshandler/IExceptionsHandler";
import { User } from "../models/entities/User";
import { RequestException } from "crisper.ko/asyncrequest/exceptions/RequestException";

@ViewModel("my-objects")
export class MyObjects implements IObservable, IExceptionsHandler {
    @Observable() public active: boolean = false;
    @Observable() public count: number = 0;
    @Observable() public mode: string = "LIST";
    public refreshEventEmitter: KnockoutObservable<any> = ko.observable().extend({ notify: "always" });
    @Required("myObjectsCollection")
    public myObjectsCollection: KnockoutObservableArray<IREObject>;
    @Required("favoritesCollection")
    public favoritesCollection: KnockoutObservableArray<IREObject>;
    @Required("profile")
    private profile: User;
    @Required(new Interface<IREObjectsService>("IREObjectsService"))
    private reObjectService: IREObjectsService;
    @Required("postbox")
    private postbox: KnockoutSubscribable<any>;
    
    @PostConstruct()
    public init(): void {
        this.getObservableFor("mode").subscribe(() => this.refreshEventEmitter(true));
        this.postbox.subscribe(page => {
            if (page[0] == "MY_OBJECTS") this.refresh();
            else if (page[0] == 'FAVORITES') {
                this.count = this.favoritesCollection().length;
                this.refreshEventEmitter(true);
            }
        }, this, "navigation.page");
        this.favoritesCollection.subscribe(objects => this.reObjectService.saveFavorites(objects));
        this.favoritesCollection(this.reObjectService.getFavorites());
    }
    
    @Throws()
    public async refresh(): Promise<void> {
        this.active = true;
        this.myObjectsCollection(await this.reObjectService.getMy(this.profile));
        this.count = this.myObjectsCollection().length;
        this.active = false;
        this.refreshEventEmitter(true);
    }
    
    @Catch([RequestException])
    private anauthorized(ex: RequestException): boolean {
        this.count = 0;
        this.myObjectsCollection([]);
        this.active = false;
        return ex.getStatus() == 400;
    }
    
    @Catch([Exception])
    private hideLoader(): boolean {
        this.active = false;
        return false;
    }
    
    public getObservableFor<T extends KnockoutSubscribable<any>>(key: string): T {return null; }
    
    implementsIObservable() {}
    implementsIExceptionsHandler() {}
}