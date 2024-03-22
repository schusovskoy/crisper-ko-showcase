import { Prototype } from "crisper.di/annotations/Prototype";
import { WebComponent } from "crisper.ko/annotations/WebComponent";
import { InitComponent } from "crisper.ko/annotations/InitComponent";

@Prototype()
@WebComponent("slider")
export class Slider {
    public photos: KnockoutObservableArray<string> | KnockoutComputed<Array<string>>;
    public position: KnockoutObservable<number> = ko.observable(0);
    public selected: KnockoutObservable<string>;
    private count: number;
    private delta: number;
    private scrollIndex: number = 0;
    
    @InitComponent()
    public init(params: { photos: KnockoutObservableArray<string> | Array<string> | KnockoutComputed<Array<string>>,
        selected: KnockoutObservable<string>, delta: number, count: number }): void {
        if (params.photos instanceof Array) this.photos = ko.observableArray(<Array<string>> params.photos);
        else this.photos = <KnockoutObservableArray<string> | KnockoutComputed<Array<string>>> params.photos;
        this.selected = params.selected;
        this.count = params.count;
        this.delta = params.delta;
        
        if (this.selected() == "" ||
            !this.selected() ||
            this.photos().indexOf(this.selected()) == -1)
            this.selected(this.photos()[0]);
        
        //noinspection TypeScriptValidateTypes
        this.photos.subscribe(() => {
            this.position(0);
            this.scrollIndex = 0;
            this.selected(this.photos()[0]);
        });
    }
    
    public left(): void {
        if (this.scrollIndex > 0) {
            this.position(this.position() + this.delta);
            this.scrollIndex--;
        }
    }
    
    public right(): void {
        if (this.photos().length - this.count > this.scrollIndex) {
            this.position(this.position() - this.delta);
            this.scrollIndex++;
        }
    }
    
    public select(photo: string): void { this.selected(photo); }
}