import { IAuthService } from "../models/services/interfaces/IAuthService";
import { Alert } from "./Alert";
import { Auth } from "./Auth";
import { ViewModel } from "crisper.ko/annotations/ViewModel";
import { Interface } from "crisper.std/Interface";
import { Required } from "crisper.di/annotations/Required";
import { IObservable } from "crisper.ko/interceptors/observable/IObservable";
import { Observable } from "crisper.ko/interceptors/observable/Observable";
import { RequestException } from "crisper.ko/asyncrequest/exceptions/RequestException";
import { SocialUser } from "../models/entities/SocialUser";
import { SocialExtra } from "./SocialExtra";
import { User } from "../models/entities/User";
import { SocialException } from "../models/exceptions/SocialException";
import { IExceptionsHandler } from "crisper.ko/interceptors/exceptionshandler/IExceptionsHandler";
import { Catch } from "crisper.ko/interceptors/exceptionshandler/Catch";
import { Exception } from "crisper.std/Exception";
import { Throws } from "crisper.ko/interceptors/exceptionshandler/Throws";

//noinspection JSAnnotator
@ViewModel("social")
export class Social implements IObservable, IExceptionsHandler {
    @Observable() public active: boolean = false;
    @Required()
    private socialUser: SocialUser;
    @Required()
    private socialExtra: SocialExtra;
    @Required("profile")
    private profile: User;
    @Required(new Interface<IAuthService>("IAuthService"))
    private authService: IAuthService;
    @Required()
    private alert: Alert;
    @Required()
    private auth: Auth;
    
    @Throws()
    public async signin(social: string): Promise<void> {
        if (this.active) return;
        this.active = true;
        this.socialUser.social = social;
        await this.authService.signinSocial(this.socialUser, this.profile);
        this.active = false;
        this.auth.hide();
    }
    
    @Catch([SocialException])
    private catchSocialException(): boolean {
        this.active = false;
        this.alert.header = "Авторизация";
        this.alert.showCancel = false;
        this.alert.text = "Ошибка авторизации через социальную сеть";
        this.alert.show();
        return true;
    }
    
    @Catch([RequestException])
    private catchAdditionalInfo(exception: RequestException): boolean {
        if (exception.getStatus() != 449) return false;
        this.active = false;
        this.socialExtra.show();
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