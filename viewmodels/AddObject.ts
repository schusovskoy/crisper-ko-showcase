import { ViewModel } from "crisper.ko/annotations/ViewModel";
import { Required } from "crisper.di/annotations/Required";
import { PostConstruct } from "crisper.di/annotations/PostConstruct";
import { REObject } from "../models/entities/REObject";
import { Interface } from "crisper.std/Interface";
import { ICitiesService } from "../models/services/interfaces/ICitiesService";
import { IObservable } from "crisper.ko/interceptors/observable/IObservable";
import { Observable } from "crisper.ko/interceptors/observable/Observable";
import { User } from "../models/entities/User";
import { RequestException } from "crisper.ko/asyncrequest/exceptions/RequestException";
import { IREObjectsService } from "../models/services/interfaces/IREObjectsService";
import { REObjectErrors } from "../models/entities/REObjectErrors";
import { IExceptionsHandler } from "crisper.ko/interceptors/exceptionshandler/IExceptionsHandler";
import { Throws } from "crisper.ko/interceptors/exceptionshandler/Throws";
import { Catch } from "crisper.ko/interceptors/exceptionshandler/Catch";
import { Exception } from "crisper.std/Exception";
import { Alert } from "./Alert";

@ViewModel("add-object")
export class AddObject implements IObservable, IExceptionsHandler {
    @Observable() public mode: string = "ADD";
    @Observable() public active: boolean = false;
    @Observable() public regions: Array<string> = [];
    @Required("reObject")
    public reObject: REObject;
    @Required("reObjectErrors")
    public reObjectErrors: REObjectErrors;
    @Required("profile")
    public profile: User;
    @Required(new Interface<ICitiesService>("ICitiesService"))
    public citiesService: ICitiesService;
    @Required(new Interface<IREObjectsService>("IREObjectsService"))
    private reObjectsService: IREObjectsService;
    @Required()
    private alert: Alert;
    @Required("postbox")
    private postbox: KnockoutSubscribable<any>;
    
    @Throws()
    public async save(): Promise<void> {
        if (this.active) return;
        this.active = true;
        this.reObjectErrors.clear();
        await this.reObjectsService.save(this.reObject, this.profile);
        this.reObject.clear();
        this.active = false;
    
        this.alert.header = "Добавление объявления";
        this.alert.showCancel = false;
        this.alert.text = "Объявление успешно добавлено на сайт";
        if (!this.profile.token)
            this.alert.text = "Объявление успешно добавлено на сайт. Обращаем ваше внимание на то, что объявление " +
                              "отправленное без регистрации нельзя будет отредактировать или удалить досрочно.";
        this.alert.show();
    }
    
    @Throws()
    public async update(): Promise<void> {
        if (this.active) return;
        this.active = true;
        this.reObjectErrors.clear();
        await this.reObjectsService.update(this.reObject, this.profile);
        this.reObject.clear();
        this.active = false;
        history.pushState(null, null, "/find/my");
    }
    
    public clearError(vm: AddObject, event: JQueryEventObject): void {
        this.reObjectErrors[(<HTMLElement> event.currentTarget).getAttribute("name")] = "";
    }
    
    @PostConstruct()
    public init(): void {
        this.reObject.getObservableFor<KnockoutObservable<string>>("city")
            .subscribe(this.loadRegions.bind(this));
        this.postbox.subscribe(page => {
            if (page[0] == "ADD_OBJECT") {
                this.mode = "ADD";
                this.reObject.clear();
                this.reObjectErrors.clear();
            }
            else if (page[0] == "EDIT") {
                this.mode = "EDIT";
                this.reObjectErrors.clear();
                this.edit(page[1]);
            }
        }, this, "navigation.page");
    }
    
    @Throws()
    private async edit(id: string): Promise<void> {
        this.active = true;
        this.reObject.update(await this.reObjectsService.getForEdit(id));
        this.active = false;
    }
    
    private async loadRegions(city: string): Promise<void> {
        try {
            this.regions = await this.citiesService.searchRegions(city);
        } catch (ex) {
            this.regions = [];
        }
        this.reObject.region = "";
    }
    
    @Catch([RequestException])
    private catchRequestError(exception: RequestException): boolean {
        if (exception.getStatus() != 400 ) return false;
        this.reObjectErrors.update(JSON.parse(exception.getMessage()));
        this.active = false;
        return true;
    }
    
    @Catch([Exception])
    private catchExceptions(): boolean {
        this.active = false;
        return false;
    }
    
    public getObservableFor<T extends KnockoutSubscribable<any>>(key: string): T { return null; }
    
    implementsIObservable() {}
    implementsIExceptionsHandler() {}
}