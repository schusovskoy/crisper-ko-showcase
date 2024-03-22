ko.bindingHandlers["scrollTo"] = {
    update(element: HTMLElement, valueAccessor: () => number) {
        valueAccessor();
        if (!ko.utils.domData.get(element, "scroll")) return;
        
        const scroll = ko.utils.domData.get(element, "scroll");
        scroll.scrollTo(0, valueAccessor());
    }
};