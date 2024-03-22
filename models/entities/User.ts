import { IUser } from "./interfaces/IUser";
import { IObservable } from "crisper.ko/interceptors/observable/IObservable";
import { IUpdatable } from "crisper.ko/interceptors/updatable/IUpdatable";
import { ISerializable } from "crisper.ko/interceptors/serializable/ISerializable";
import { Observable } from "crisper.ko/interceptors/observable/Observable";
import { FileObject } from "./FileObject";

//noinspection JSAnnotator
export class User implements IUser, IObservable, IUpdatable<IUser>, ISerializable {
    public id: string = "";
    @Observable() public email: string = "";
    @Observable() public phone: string = "";
    @Observable() public fio: string = "";
    @Observable() public password: string = "";
    @Observable() public second: string = "";
    @Observable() public token: string = null;
    @Observable() public viber: boolean = false;
    @Observable() public whatsapp: boolean = false;
    @Observable() public registerDate: number = 0;
    public photo: FileObject;
    
    public clear(): void {
        //noinspection TypeScriptValidateTypes
        this.update({
                        id: "", email: "", phone: "", fio: "", password: "", second: "", token: null, viber: false,
                        whatsapp: false, registerDate: 0
                    });
        this.photo.clear();
    }
    
    public serializeForUpdate(): string {
        var result: string = this.serializeUrlEncoded(false, "id", "phone", "fio", "password", "second", "viber", "whatsapp");
        result += `&photo.path=${this.photo.path}`;
        return result;
    }
    
    public serializeForSaving(): string {
        var result: string = this.serializeJSON(true, "password", "second", "photo").slice(0,-1);
        result += `,"photo":{"path":${this.photo.path ? '"' + this.photo.path + '"' : null}}}`;
        return result;
    }
    
    public updateData(instance: IUser): void {
        this.id = instance.id;
        this.email = instance.email; 
        this.phone = instance.phone;
        this.fio = instance.fio;
        if (instance.token) this.token = instance.token;
        this.viber = instance.viber;
        this.whatsapp = instance.whatsapp;
        this.registerDate = instance.registerDate;
        if (instance.photo) this.photo.path = instance.photo.path;
    }
    
    public update(instance: IUser): void { }
    
    public serializeUrlEncoded(isExclude: boolean, ...properties: Array<string>): string { return null; }
    
    public serializeJSON(isExclude: boolean, ...properties: Array<string>): string { return null; }
    
    public getObservableFor<T extends KnockoutSubscribable<any>>(key: string): T { return null; }
    
    implementsIUser() {}
    implementsIObservable() {}
    implementsIUpdatable() {}
    implementsISerializable() {}
}