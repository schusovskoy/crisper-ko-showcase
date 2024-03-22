import { ViewModel } from "crisper.ko/annotations/ViewModel";
import { IObservable } from "crisper.ko/interceptors/observable/IObservable";
import { Required } from "crisper.di/annotations/Required";
import { REObject } from "../models/entities/REObject";
import { Observable } from "crisper.ko/interceptors/observable/Observable";
import { IREObjectsService } from "../models/services/interfaces/IREObjectsService";
import { Interface } from "crisper.std/Interface";
import { IExceptionsHandler } from "crisper.ko/interceptors/exceptionshandler/IExceptionsHandler";
import { Throws } from "crisper.ko/interceptors/exceptionshandler/Throws";
import { Catch } from "crisper.ko/interceptors/exceptionshandler/Catch";
import { Exception } from "crisper.std/Exception";
import { PhotoViewer } from "./PhotoViewer";
import { PostConstruct } from "crisper.di/annotations/PostConstruct";
import { IREObject } from "../models/entities/interfaces/IREObject";
import { Alert } from "./Alert";
import { User } from "../models/entities/User";

@ViewModel("object-viewer")
export class ObjectViewer implements IObservable, IExceptionsHandler {
    @Observable() public id: string = "";
    @Observable() public mode: string = "VIEW";
    @Observable() public photo: string;
    @Observable() public active: boolean = false;
    @Observable() public scrollPos: number = 0;
    @Required("selectedObject")
    public selectedObject: REObject;
    @Required("favoritesCollection")
    private favoritesCollection: KnockoutObservableArray<IREObject>;
    @Required(new Interface<IREObjectsService>("IREObjectsService"))
    private reObjectsService: IREObjectsService;
    @Required("profile")
    private profile: User;
    @Required()
    private photoViewer: PhotoViewer;
    @Required()
    private alert: Alert;
    @Required("postbox")
    private postbox: KnockoutSubscribable<any>;
    
    @Observable()
    public getPhotos(): Array<string> {
        return this.selectedObject.files.map(file => `${file.path}/m.jpg`);
    }
    
    @Observable()
    public additionalLength(): number {
        return (this.selectedObject.hypothec ? 1 : 0) +
               (this.selectedObject.lift ? 1 : 0) +
               (this.selectedObject.parking ? 1 : 0) +
               (this.selectedObject.internet ? 1 : 0) +
               (this.selectedObject.furniture ? 1 : 0) +
               (this.selectedObject.appliances ? 1 : 0) +
               (this.selectedObject.water ? 1 : 0) +
               (this.selectedObject.gas ? 1 : 0) +
               (this.selectedObject.electricity ? 1 : 0) +
               (this.selectedObject.canalization ? 1 : 0);
    }
    
    public viewPhoto(): void {
        this.photoViewer.show(this.getPhotos(), this.photo);
    }
    
    @PostConstruct()
    public init(): void {
        this.getObservableFor("scrollPos").extend({ notify: "always" });
        
        this.postbox.subscribe(page => {
            if (page[0] == "OBJECT_VIEWER") {
                this.mode = "VIEW";
                this.refresh(page[1]);
            } else if (page[0] == "MY_OBJECT_VIEWER") {
                this.mode = "EDIT";
                this.id = page[1];
                this.refresh(page[1]);
            } else if (page[0] == "FAV_OBJECT") {
                this.mode = "FAVORITE";
                this.id = page[1];
                this.refresh(page[1]);
            }
        }, this, "navigation.page");
    }
    
    public resetScroll(): boolean {
        this.scrollPos = 0;
        return true;
    }
    
    @Throws()
    public async remove(): Promise<void> {
        this.alert.header = "Удаление объявления";
        this.alert.showCancel = true;
        this.alert.text = "Вы действительно хотите удалить объявление?";
        if (await this.alert.show()) {
            this.active = true;
            await this.reObjectsService.remove(this.id, this.profile);
            this.active = false;
            history.replaceState(null, null, "/find/my");
        }
    }
    
    public removeFavorite(): void {
        const index: number = this.favoritesCollection().findIndex(object => object.id == this.selectedObject.id);
        this.favoritesCollection.splice(index, 1);
        history.pushState(null, null, "/favorites");
    }
    
    @Throws()
    public async refresh(id: string): Promise<void> {
        this.active = true;
        this.selectedObject.update(await this.reObjectsService.getById(id));
        this.active = false;
    }
    
    @Catch([Exception])
    public hideActivity(): boolean {
        this.active = false;
        return false;
    }
    
    public getObservableFor<T extends KnockoutSubscribable<any>>(key: string): T { return null; }
    
    implementsIObservable() {}
    implementsIExceptionsHandler() {}
}