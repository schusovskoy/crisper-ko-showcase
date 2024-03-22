import { IUserErrors } from "./interfaces/IUserErrors";
import { IUpdatable } from "crisper.ko/interceptors/updatable/IUpdatable";
import { Observable } from "crisper.ko/interceptors/observable/Observable";
import { IObservable } from "crisper.ko/interceptors/observable/IObservable";

//noinspection JSAnnotator
export class UserErrors implements IUserErrors, IObservable, IUpdatable<IUserErrors> {
    @Observable() public email: string = "";
    @Observable() public phone: string = "";
    @Observable() public fio: string = "";
    @Observable() public password: string = "";
    
    public update(instance: IUserErrors): void {}
    
    implementsIUpdatable() {}
    implementsIUserErrors() {}
    implementsIObservable() {}
}