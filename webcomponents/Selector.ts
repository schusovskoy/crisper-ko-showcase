import { WebComponent } from "crisper.ko/annotations/WebComponent";
import { InitComponent } from "crisper.ko/annotations/InitComponent";
import { Prototype } from "crisper.di/annotations/Prototype";

@Prototype()
@WebComponent("selector")
export class Selector {
    public isShown: KnockoutObservable<boolean> = ko.observable(false);
    public value: KnockoutObservable<string>;
    public text: KnockoutObservable<string> = ko.observable("");
    private listContainer: JQuery;
    
    public open(): void { this.isShown(true); }
    
    @InitComponent()
    public init(params: { value: KnockoutObservable<string> },
                componentInfo: KnockoutComponentTypes.ComponentInfo): void {
        this.value = params.value;
        this.listContainer = $(componentInfo.element).find("ul");
        $(window).on("click", event => { if (event.target != componentInfo.element.firstChild) this.isShown(false); });
        $(componentInfo.element).on("click", "li", event => this.value(event.target.getAttribute("value")));
        
        const list: JQuery = $(componentInfo.templateNodes).filter("li");
        for (let i = 0; i < list.length; i++) {
            if (this.value() == list[i].getAttribute("value")) {
                this.text(list[i].textContent);
                break;
            }
        }
        if (this.text() == "") {
            this.value(list[0].getAttribute("value"));
            this.text(list[0].textContent);
        }
        
        this.value.subscribe(value => this.update());
    }
    
    private update(): void {
        const list: JQuery = this.listContainer.find("li");
        for (let i = 0; i < list.length; i++) {
            if (this.value() == list[i].getAttribute("value")) {
                this.text(list[i].textContent);
                return;
            }
        }
        this.value(list[0].getAttribute("value"));
    }
}