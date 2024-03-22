import { WebComponent } from "crisper.ko/annotations/WebComponent";
import { Prototype } from "crisper.di/annotations/Prototype";
import { InitComponent } from "crisper.ko/annotations/InitComponent";

@Prototype()
@WebComponent("content-slider")
export class ContentSlider {
    public position: KnockoutObservable<number> = ko.observable(0);
    private length: KnockoutObservable<number> | KnockoutComputed<number>;
    private count: number;
    private delta: number;
    private scrollIndex: number = 0;
    
    @InitComponent()
    public init(params: { length: number | KnockoutObservable<number> | KnockoutComputed<number>,
        delta: number, count: number }): void {
        if (params.length instanceof Function)
            this.length = <KnockoutObservable<number> | KnockoutComputed<number>> params.length;
        else this.length = ko.observable(<number> params.length);
        this.count = params.count;
        this.delta = params.delta;
        
        //noinspection TypeScriptValidateTypes
        this.length.subscribe(() => {
            this.position(0);
            this.scrollIndex = 0;
        });
    }
    
    public left(): void {
        if (this.scrollIndex > 0) {
            this.position(this.position() + this.delta);
            this.scrollIndex--;
        }
    }
    
    public right(): void {
        if (this.length() - this.count > this.scrollIndex) {
            this.position(this.position() - this.delta);
            this.scrollIndex++;
        }
    }
}