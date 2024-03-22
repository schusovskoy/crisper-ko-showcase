import { Auth } from "./Auth";
import { ViewModel } from "crisper.ko/annotations/ViewModel";
import { Required } from "crisper.di/annotations/Required";
import { Observable } from "crisper.ko/interceptors/observable/Observable";
import { IObservable } from "crisper.ko/interceptors/observable/IObservable";
import { RequestException } from "crisper.ko/asyncrequest/exceptions/RequestException";
import { PostConstruct } from "crisper.di/annotations/PostConstruct";
import { User } from "../models/entities/User";
import { IProfileService } from "../models/services/interfaces/IProfileService";
import { Interface } from "crisper.std/Interface";
import { Throws } from "crisper.ko/interceptors/exceptionshandler/Throws";
import { IExceptionsHandler } from "crisper.ko/interceptors/exceptionshandler/IExceptionsHandler";
import { Catch } from "crisper.ko/interceptors/exceptionshandler/Catch";
import { ProfileViewer } from "./ProfileViewer";
import { RequestsList } from "./RequestsList";

//noinspection JSAnnotator
@ViewModel("navigation")
export class Navigation implements IObservable, IExceptionsHandler {
    @Observable() public page: string = "START";
    @Required("profile")
    public profile: User;
    @Required(new Interface<IProfileService>("IProfileService"))
    private profileService: IProfileService;
    @Required()
    private auth: Auth;
    @Required()
    private profileViewer: ProfileViewer;
    @Required()
    private requestsList: RequestsList;
    @Required("postbox")
    private postbox: KnockoutSubscribable<any>;
    
    @Observable()
    public fio(): string {
        if (!this.profile.fio) return "";
        
        const splittedFio = this.profile.fio.split(" ");
        if (splittedFio.length > 1) return splittedFio[1];
        return splittedFio[0];
    }
    
    @Throws()
    @PostConstruct()
    public init(): Promise<void> {
        return this.profileService.refresh(this.profile);
    }
    
    public logout(): void { this.profileService.logout(this.profile); }
    
    public showAuth(): void { this.auth.show(); }
    
    public showProfile(): void { this.profileViewer.show(); }
    
    public showRequests(): void { this.requestsList.show(); }
    
    public switchPage(page: string, data?: any): void {
        this.page = page;
        this.postbox.notifySubscribers([page, data], "navigation.page");
    }
    
    @Catch([RequestException])
    private catchAnauthorized(exception: RequestException): boolean {
        if (exception.getStatus() != 400) return false;
        this.profileService.logout(this.profile);
        return true;
    }
    
    implementsIObservable() {}
    implementsIExceptionsHandler() {}
}