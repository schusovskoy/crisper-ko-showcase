import { User } from "../models/entities/User";
import { Alert } from "./Alert";
import { IAuthService } from "../models/services/interfaces/IAuthService";
import { ViewModel } from "crisper.ko/annotations/ViewModel";
import { Required } from "crisper.di/annotations/Required";
import { Interface } from "crisper.std/Interface";
import { RequestException } from "crisper.ko/asyncrequest/exceptions/RequestException";
import { Observable } from "crisper.ko/interceptors/observable/Observable";
import { IObservable } from "crisper.ko/interceptors/observable/IObservable";
import { Throws } from "crisper.ko/interceptors/exceptionshandler/Throws";
import { Catch } from "crisper.ko/interceptors/exceptionshandler/Catch";
import { Exception } from "crisper.std/Exception";
import { IExceptionsHandler } from "crisper.ko/interceptors/exceptionshandler/IExceptionsHandler";

//noinspection JSAnnotator
@ViewModel("remind")
export class Remind implements IObservable, IExceptionsHandler {
    @Observable() public isShown: boolean = false;
    @Observable() public active: boolean = false;
    @Required("signinCredentials")
    public signinCredentials: User;
    @Required(new Interface<IAuthService>("IAuthService"))
    private authService: IAuthService;
    @Required()
    private alert: Alert;
    
    public show(): void { this.isShown = true; }
    
    public hide(): void { this.isShown = false; }
    
    @Throws()
    public async remind(): Promise<void> {
        if (this.active) return;
        this.active = true;
        await this.authService.remind(this.signinCredentials);
        this.active = false;
        
        this.alert.showCancel = false;
        this.alert.header = "Восстановление пароля";
        this.alert.text = "Новый пароль отправлен на вашу почту";
        await this.alert.show();
        this.hide();
    }
    
    @Catch([RequestException])
    private catchNotFound(exception: RequestException): boolean {
        if (exception.getStatus() != 404) return false;
        this.active = false;
        this.alert.text = "Пользователь с таким E-mail не найден";
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