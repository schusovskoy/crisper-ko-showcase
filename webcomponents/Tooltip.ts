import { Prototype } from "crisper.di/annotations/Prototype";
import { WebComponent } from "crisper.ko/annotations/WebComponent";
import { InitComponent } from "crisper.ko/annotations/InitComponent";

@Prototype()
@WebComponent("tooltip")
export class Tooltip {
    public isOpen: KnockoutObservable<boolean> = ko.observable(false);
    
    @InitComponent()
    public init(params: { width: number }, componentInfo: KnockoutComponentTypes.ComponentInfo): void {
        $(window).on("click", event => this.isOpen(false));
        $(componentInfo.element).on("click", event => {
            if (event.target.nodeName != "A") event.stopPropagation();
            else this.isOpen(false);
        });
    
        this.isOpen.subscribe(state => {
            if (!state) return;
            if ($(componentInfo.element).outerWidth() / 2 +
                $(componentInfo.element).offset().left +
                params.width / 2 >= $(document.body).outerWidth())
                $(componentInfo.element).find(".tooltip__container").addClass("tooltip__container_right");
            else if ($(componentInfo.element).outerWidth() / 2 +
                     $(componentInfo.element).offset().left -
                     params.width / 2 <= 0)
                $(componentInfo.element).find(".tooltip__container").addClass("tooltip__container_left");
            else {
                $(componentInfo.element).find(".tooltip__container").removeClass("tooltip__container_right");
                $(componentInfo.element).find(".tooltip__container").removeClass("tooltip__container_left");
            }
        });
    }
}