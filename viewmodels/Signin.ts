import { User } from "../models/entities/User";
import { Auth } from "./Auth";
import { Alert } from "./Alert";
import { IAuthService } from "../models/services/interfaces/IAuthService";
import { Remind } from "./Remind";
import { ViewModel } from "crisper.ko/annotations/ViewModel";
import { Required } from "crisper.di/annotations/Required";
import { Interface } from "crisper.std/Interface";
import { RequestException } from "crisper.ko/asyncrequest/exceptions/RequestException";
import { IObservable } from "crisper.ko/interceptors/observable/IObservable";
import { Observable } from "crisper.ko/interceptors/observable/Observable";
import { IExceptionsHandler } from "crisper.ko/interceptors/exceptionshandler/IExceptionsHandler";
import { Throws } from "crisper.ko/interceptors/exceptionshandler/Throws";
import { Catch } from "crisper.ko/interceptors/exceptionshandler/Catch";
import { Exception } from "crisper.std/Exception";

//noinspection JSAnnotator
@ViewModel("signin")
export class Signin implements IObservable, IExceptionsHandler {
    @Observable() public active: boolean = false;
    @Required("signinCredentials")
    public signinCredentials: User;
    @Required("profile")
    private profile: User;
    @Required(new Interface<IAuthService>("IAuthService"))
    private authService: IAuthService;
    @Required()
    private auth: Auth;
    @Required()
    private alert: Alert;
    @Required()
    private remind: Remind;
    
    @Throws()
    public async signin(): Promise<void> {
        if (this.active) return;
        this.active = true;
        await this.authService.signin(this.signinCredentials, this.profile);
        this.active = false;
        this.auth.hide();
    }
    
    public showSignup(): void { this.auth.page = "SIGNUP"; }
    
    public showRemind(): void { this.remind.show(); }
    
    @Catch([RequestException])
    private catchClientErrors(exception: RequestException): boolean {
        if (exception.getStatus() != 400) return false;
        this.active = false;
        this.alert.header = "Авторизация";
        this.alert.text = JSON.parse(exception.getMessage()).message;
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