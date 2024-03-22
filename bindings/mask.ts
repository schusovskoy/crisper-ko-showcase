ko.bindingHandlers["mask"] = {
    init: (element: HTMLElement, valueAccessor: () => { pattern: string, value: KnockoutObservable<string> }) => {
        var inputMask: Inputmask = new Inputmask(valueAccessor().pattern);
        inputMask.mask(element);
        
        $(element).on("change", (event: JQueryEventObject) => {
            valueAccessor().value(event.target["inputmask"]["unmaskedvalue"]());
        });
    },
    update: (element: HTMLElement, valueAccessor: () => { pattern: string, value: KnockoutObservable<string> }) => {
        element["value"] = valueAccessor().value();
    }
};