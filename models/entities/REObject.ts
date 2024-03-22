import { FileObject } from "./FileObject";
import { IObservable } from "crisper.ko/interceptors/observable/IObservable";
import { Observable } from "crisper.ko/interceptors/observable/Observable";
import { ISerializable } from "crisper.ko/interceptors/serializable/ISerializable";
import { IREObject } from "./interfaces/IREObject";
import { IUpdatable } from "crisper.ko/interceptors/updatable/IUpdatable";

//noinspection JSAnnotator
export class REObject implements IREObject, IObservable, ISerializable, IUpdatable<IREObject> {
    @Observable() public id: string = "";
    @Observable() public coordinate: { type: string, coordinates: Array<number> } = null;
    @Observable() public city: string = "";
    @Observable() public region: string = "";
    @Observable() public address: string = "";
    @Observable() public operation: string = "RENT";
    @Observable() public object: string = "APARTMENT";
    @Observable() public sqmain: string = "";
    @Observable() public sqliving: string = "";
    @Observable() public sqkitchen: string = "";
    @Observable() public sqarea: string = "";
    @Observable() public cost: string = "";
    @Observable() public floor: string = "";
    @Observable() public floors: string = "";
    @Observable() public rooms: string = "";
    @Observable() public type: string = "PANEL";
    @Observable() public industrialType: string = "OFFICE";
    @Observable() public hypothec: boolean = false;
    @Observable() public lift: boolean = false;
    @Observable() public parking: boolean = false;
    @Observable() public internet: boolean = false;
    @Observable() public furniture: boolean = false;
    @Observable() public appliances: boolean = false;
    @Observable() public water: boolean = false;
    @Observable() public gas: boolean = false;
    @Observable() public electricity: boolean = false;
    @Observable() public canalization: boolean = false;
    @Observable() public decor: boolean = false;
    @Observable() public description: string = "";
    @Observable() public files: Array<FileObject> = [];
    @Observable() public fio: string = "";
    @Observable() public phone: string = "";
    @Observable() public addDate: string = "";
    @Observable() public relatedObjects: Array<IREObject> = [];
    
    @Observable()
    public fullAddress(): string {
        return this.city + " " + this.address;
    }
    
    public serializeForSaving(): string {
        var result: string = this.serializeUrlEncoded(true, "coordinate", "files", "relatedObjects");
        result += `&coordinate=${JSON.stringify(this.coordinate)}`;
        for (let i = 0; i < this.files.length; i++) {
            result += `&files[${i}].path=${this.files[i].path}&files[${i}].avatar=${this.files[i].avatar}`;
        }
        return result;
    }
    
    public clear(): void {
        this.update({
                        id: "", coordinate: null, address: "", operation: "RENT",
                        object: "APARTMENT", sqmain: "", sqliving: "", sqkitchen: "", sqarea: "", cost: "", floor: "",
                        floors: "", rooms: "", type: "PANEL", industrialType: "OFFICE", hypothec: false, lift: false,
                        parking: false, internet: false, furniture: false, appliances: false, water: false, gas: false,
                        electricity: false, canalization: false, decor: false, description: "", files: [], fio: "",
                        phone: "", addDate: ""
                    });
    }
    
    public getObservableFor<T extends KnockoutSubscribable<any>>(key: string): T { return null; }
    
    public serializeUrlEncoded(isExclude: boolean, ...properties: Array<string>): string { return null; }
    
    public update(instance: IREObject): void {}
    
    implementsIUpdatable() {}
    implementsIREObject() {}
    implementsIObservable() {}
    implementsISerializable() {}
}