import { WebComponent } from "crisper.ko/annotations/WebComponent";
import { Prototype } from "crisper.di/annotations/Prototype";
import { InitComponent } from "crisper.ko/annotations/InitComponent";

@Prototype()
@WebComponent("input-number")
export class InputNumber {
    public length: number = 3;
    public value: KnockoutObservable<string>;
    
    public increase(): void {
        if (this.value() == "") this.value("0");
        else if ((parseInt(this.value()) + 1).toString().length > this.length) return;
        
        this.value((parseInt(this.value()) + 1).toString());
    }
    
    public decrease(): void {
        if (this.value() == "1") {
            this.value("");
            return;
        } else if (this.value() == "") return;
        
        this.value((parseInt(this.value()) - 1).toString());
    }
    
    @InitComponent()
    public init(params: { value: KnockoutObservable<string>, length: number },
                componentInfo: KnockoutComponentTypes.ComponentInfo) {
        if (params.length) this.length = params.length;
        if (params.value instanceof Function) this.value = params.value;
        else this.value = ko.observable("");
    }
}