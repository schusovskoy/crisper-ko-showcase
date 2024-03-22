import { UserErrors } from "../models/entities/UserErrors";
import { User } from "../models/entities/User";
import { Auth } from "./Auth";
import { Alert } from "./Alert";
import { IAuthService } from "../models/services/interfaces/IAuthService";
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
@ViewModel("signup")
export class Signup implements IObservable, IExceptionsHandler {
    @Observable() public active: boolean = false;
    @Required("signupErrors")
    public signupErrors: UserErrors;
    @Required("signupCredentials")
    public signupCredentials: User;
    @Required(new Interface<IAuthService>("IAuthService"))
    private authService: IAuthService;
    @Required()
    private auth: Auth;
    @Required()
    private alert: Alert;
    
    @Throws()
    public async signup(): Promise<void> {
        if (this.active) return;
        this.active = true;
        //noinspection TypeScriptValidateTypes
        this.signupErrors.update({ email: "", fio: "", phone: "", password: "" });
        await this.authService.signup(this.signupCredentials);
        this.active = false;
        
        this.alert.header = "Регистрация";
        this.alert.showCancel = false;
        this.alert.text = "Поздравляем!\r\nРегистрация прошла успешно. Проверте email для активации аккунта.";
        await this.alert.show();
        this.auth.page = "SIGNIN";
    }
    
    public clearError(vm: Signup, event: JQueryEventObject): void {
        this.signupErrors[event.target.getAttribute("name")] = "";
    }
    
    public showSignin(): void { this.auth.page = "SIGNIN"; }
    
    @Catch([RequestException])
    private catchValidationErrors(exception: RequestException): boolean {
        if (exception.getStatus() != 400) return false;
        this.active = false;
        this.signupErrors.update(JSON.parse(exception.getMessage()));
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