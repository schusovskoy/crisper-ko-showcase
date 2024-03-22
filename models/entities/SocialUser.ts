import { IObservable } from "crisper.ko/interceptors/observable/IObservable";
import { Observable } from "crisper.ko/interceptors/observable/Observable";
import { ISerializable } from "crisper.ko/interceptors/serializable/ISerializable";

//noinspection JSAnnotator
export class SocialUser implements IObservable, ISerializable {
    @Observable() public phone: string = "";
    public social: string = "";
    public token: string = "";
    
    public serializeUrlEncoded(isExclude: boolean, ...properties: Array<string>): string { return null; }
    
    public getObservableFor<T extends KnockoutSubscribable<any>>(key: string): T { return null; }
    
    implementsISerializable() {}
    implementsIObservable() {}
}