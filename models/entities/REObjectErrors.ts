import { IREObjectErrors } from "./interfaces/IREObjectErrors";
import { IObservable } from "crisper.ko/interceptors/observable/IObservable";
import { IUpdatable } from "crisper.ko/interceptors/updatable/IUpdatable";
import { Observable } from "crisper.ko/interceptors/observable/Observable";

//noinspection JSAnnotator
export class REObjectErrors implements IREObjectErrors, IObservable, IUpdatable<IREObjectErrors> {
    @Observable() city: string = "";
    @Observable() address: string = "";
    @Observable() sqmain: string = "";
    @Observable() sqliving: string = "";
    @Observable() sqkitchen: string = "";
    @Observable() sqarea: string = "";
    @Observable() cost: string = "";
    @Observable() floor: string = "";
    @Observable() floors: string = "";
    @Observable() rooms: string = "";
    @Observable() description: string = "";
    @Observable() fio: string = "";
    @Observable() phone: string = "";
    
    public clear(): void {
        this.update({
                        city: "", address: "", sqmain: "", sqliving: "", sqkitchen: "", sqarea: "", cost: "", floor: "",
                        floors: "", rooms: "", description: "", fio: "", phone: "",
                    });
    }
    
    public update(instance: IREObjectErrors): void {}
    
    implementsIUpdatable() {}
    implementsIREObjectErrors() {}
    implementsIObservable() {}
}