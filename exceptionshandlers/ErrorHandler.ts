import { GlobalExceptionsHandler } from "crisper.ko/interceptors/exceptionshandler/GlobalExceptionsHandler";
import { IExceptionsHandler } from "crisper.ko/interceptors/exceptionshandler/IExceptionsHandler";
import { Required } from "crisper.di/annotations/Required";
import { Alert } from "../viewmodels/Alert";
import { Catch } from "crisper.ko/interceptors/exceptionshandler/Catch";
import { RequestException } from "crisper.ko/asyncrequest/exceptions/RequestException";
import { TimeoutException } from "crisper.ko/asyncrequest/exceptions/TimeoutException";
import { Exception } from "crisper.std/Exception";

@GlobalExceptionsHandler()
export class ErrorHandler implements IExceptionsHandler {
    @Required()
    private alert: Alert;
    
    @Catch([RequestException])
    private catchRequestException(exception: RequestException): boolean {
        this.alert.showCancel = false;
        this.alert.header = "Ошибка";
        if (exception.getStatus() == 500) this.alert.text = "На сервере произошла непредвиденная ошибка";
        else if (exception.getStatus() == 401) this.alert.text = "Ошибка авторизации";
        else if (exception.getStatus() == 403) this.alert.text = "Ошибка авторизации";
        this.alert.show();
        return true;
    }
    
    @Catch([TimeoutException])
    private catchTimeout(): boolean {
        this.alert.showCancel = false;
        this.alert.header = "Ошибка";
        this.alert.text = "Таймаут соединения";
        this.alert.show();
        return true;
    }
    
    @Catch([Exception])
    private catchConnectionError(): boolean {
        this.alert.showCancel = false;
        this.alert.header = "Ошибка";
        this.alert.text = "Отсутствует соединение с сервером";
        this.alert.show();
        return true;
    }
    
    implementsIExceptionsHandler() {}
}