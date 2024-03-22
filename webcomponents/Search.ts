import { Prototype } from "crisper.di/annotations/Prototype";
import { WebComponent } from "crisper.ko/annotations/WebComponent";
import { InitComponent } from "crisper.ko/annotations/InitComponent";

@Prototype()
@WebComponent("search")
export class Search {
    public value: KnockoutObservable<string>;
    public results: KnockoutObservableArray<string> = ko.observableArray([]);
    public selected: KnockoutObservable<number> = ko.observable(0);
    public placeholder: KnockoutObservable<string> | string;
    
    @InitComponent()
    public init(params: { value: KnockoutObservable<string>,
        searchMethod: (value: string) => Promise<Array<string>>
        placeholder: KnockoutObservable<string> | string }): void {
        if (params.value instanceof Function) this.value = params.value;
        else params.value = ko.observable("");
        if (params.placeholder instanceof Function) this.placeholder = <KnockoutObservable<string>> params.placeholder;
        else this.placeholder = <string> params.placeholder;
        this.searchMethod = params.searchMethod;
    }
    
    public async search(): Promise<void> {
        try {
            this.results(await this.searchMethod(this.value()));
        } catch (ex) {
            this.results([]);
        }
        this.selected(0);
    }
    
    public select(vm: this, event: KeyboardEvent): boolean {
        if (event.keyCode == 38 && this.selected() != 0) {
            this.selected(this.selected() - 1);
            return false;
        } else if (event.keyCode == 40 && this.selected() < this.results().length - 1) {
            this.selected(this.selected() + 1);
            return false;
        } else if (event.keyCode == 13 && this.results().length) {
            this.value(this.results()[this.selected()]);
            (<HTMLInputElement> event.target).blur();
            this.results([]);
            this.selected(0);
            return false;
        }
        return true;
    }
    
    public choose(vm: this, event: JQueryEventObject): void {
        this.value(event.target.textContent);
        this.results([]);
        this.selected(0);
    }
    
    private searchMethod(value: string): Promise<Array<string>> { return null; }
}