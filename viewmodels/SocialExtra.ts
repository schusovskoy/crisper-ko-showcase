import { ViewModel } from "crisper.ko/annotations/ViewModel";
import { IObservable } from "crisper.ko/interceptors/observable/IObservable";
import { Observable } from "crisper.ko/interceptors/observable/Observable";
import { Required } from "crisper.di/annotations/Required";
import { SocialUser } from "../models/entities/SocialUser";
import { Interface } from "crisper.std/Interface";
import { IAuthService } from "../models/services/interfaces/IAuthService";
import { Alert } from "./Alert";
import { User } from "../models/entities/User";
import { Auth } from "./Auth";
import { RequestException } from "crisper.ko/asyncrequest/exceptions/RequestException";
import { IExceptionsHandler } from "crisper.ko/interceptors/exceptionshandler/IExceptionsHandler";
import { Throws } from "crisper.ko/interceptors/exceptionshandler/Throws";
import { Catch } from "crisper.ko/interceptors/exceptionshandler/Catch";
import { Exception } from "crisper.std/Exception";

//noinspection JSAnnotator
@ViewModel("social-extra")
export class SocialExtra implements IObservable, IExceptionsHandler {
    @Observable() public isShown: boolean = false;
    @Observable() public active: boolean = false;
    @Required()
    public socialUser: SocialUser;
    @Required("profile")
    private profile: User;
    @Required(new Interface<IAuthService>("IAuthService"))
    private authService: IAuthService;
    @Required()
    private alert: Alert;
    @Required()
    private auth: Auth;
    
    @Throws()
    public async submit(): Promise<void> {
        if (this.active) return;
        this.active = true;
        await this.authService.signupSocial(this.socialUser, this.profile);
        this.active = false;
        this.auth.hide();
        this.hide();
    }
    
    @Catch([RequestException])
    private catchInvalid(exception: RequestException): boolean {
        if (exception.getStatus() != 400) return false;
        this.active = false;
        this.alert.header = "Авторизация";
        this.alert.showCancel = false;
        this.alert.text = "Некоректный номер или номер уже используется другим пользователем";
        this.alert.show();
        return true;
    }
    
    @Catch([Exception])
    private catchException(): boolean {
        this.active = false;
        return false;
    }
    
    public show(): void { this.isShown = true; }
    
    public hide(): void { this.isShown = false; }
    
    implementsIObservable() {}
    implementsIExceptionsHandler() {}
}