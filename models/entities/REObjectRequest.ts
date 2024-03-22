import { IObservable } from "crisper.ko/interceptors/observable/IObservable";
import { Observable } from "crisper.ko/interceptors/observable/Observable";
import { ObjectUtils } from "crisper.std/ObjectUtils";
import { ISerializable } from "crisper.ko/interceptors/serializable/ISerializable";
import { PostConstruct } from "crisper.di/annotations/PostConstruct";
import { IUpdatable } from "crisper.ko/interceptors/updatable/IUpdatable";
import { IREObjectRequest } from "./interfaces/IREObjectRequest";

//noinspection JSAnnotator
export class REObjectRequest implements IREObjectRequest, IObservable, ISerializable, IUpdatable<IREObjectRequest> {
    @Observable() public city: string = "";
    @Observable() public region: string = "";
    @Observable() public operation: string = "RENT";
    @Observable() public object: string = "APARTMENT";
    @Observable() public sqmainFrom: string = "";
    @Observable() public sqlivingFrom: string = "";
    @Observable() public sqkitchenFrom: string = "";
    @Observable() public costFrom: string = "";
    @Observable() public costTo: string = "";
    @Observable() public floorFrom: string = "";
    @Observable() public floorTo: string = "";
    @Observable() public roomsFrom: string = "";
    @Observable() public type: string = "MONOLITH,MONOLITHBRICK,PANEL,BLOCK,BRICK";
    @Observable() public sqareaFrom: string = "";
    @Observable() public industrialType: string = "OFFICE,COMMERCIAL,STOCK,MANUFACTURE,GARAGE,PARKING,HOTEL,FREE";
    @Observable() public internet: boolean = false;
    @Observable() public decor: boolean = false;
    @Observable() public hypothec: boolean = false;
    @Observable() public furniture: boolean = false;
    @Observable() public appliances: boolean = false;
    @Observable() public lift: boolean = false;
    @Observable() public gas: boolean = false;
    @Observable() public canalization: boolean = false;
    @Observable() public water: boolean = false;
    @Observable() public electricity: boolean = false;
    @Observable() public parking: boolean = false;
    @Observable() public sort: string = "addDate,asc";
    @Observable() public polygon: { type: string, coordinates: Array<Array<Array<number>>> } = null;
    
    @PostConstruct()
    public init(): void {
        this.getObservableFor("object").subscribe(this.clear.bind(this));
        this.getObservableFor("operation").subscribe(this.clear.bind(this));
    }
    
    public observe(callback: () => any, ...except: Array<string>): void {
        for (let key of ObjectUtils.getAllPropertyNames(this)) {
            if (except.indexOf(key) == -1 &&
                Reflect.hasMetadata(Observable, this.constructor.prototype, key))
                this.getObservableFor(key).subscribe(callback);
        }
    }
    
    public clear(): void {
        this.update({
                        sqmainFrom: "", region: "", sqlivingFrom: "", sqkitchenFrom: "", costFrom: "", costTo: "", floorFrom: "",
                        floorTo: "", roomsFrom: "", type: "MONOLITH,MONOLITHBRICK,PANEL,BLOCK,BRICK", sqareaFrom: "",
                        industrialType: "OFFICE,COMMERCIAL,STOCK,MANUFACTURE,GARAGE,PARKING,HOTEL,FREE",
                        internet: false, decor: false, hypothec: false, furniture: false, appliances: false, lift: false,
                        gas: false, canalization: false, water: false, electricity: false, parking: false
                    });
    }
    
    public serializeWithPolygon(): string {
        return `${this.serializeUrlEncoded(true, "polygon")}&polygon=${JSON.stringify(this.polygon)}`;
    }
    
    public setPolygon(polygon: L.LatLngBounds): void {
        this.polygon = { type: "Polygon", coordinates: [[
            [polygon.getSouthWest().lat, polygon.getSouthWest().lng],
            [polygon.getNorthWest().lat, polygon.getNorthWest().lng],
            [polygon.getNorthEast().lat, polygon.getNorthEast().lng],
            [polygon.getSouthEast().lat, polygon.getSouthEast().lng],
            [polygon.getSouthWest().lat, polygon.getSouthWest().lng]
        ]] };
    }
    
    public update(instance: IREObjectRequest): void {}
    
    public getObservableFor<T extends KnockoutSubscribable<any>>(key: string): T { return null; }
    
    public serializeUrlEncoded(isExclude: boolean, ...properties: Array<string>): string { return null; }
    
    implementsISerializable() {}
    implementsIObservable() {}
    implementsIREObjectRequest() {}
    implementsIUpdatable() {}
}