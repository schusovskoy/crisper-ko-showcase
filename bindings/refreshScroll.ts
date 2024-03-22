ko.bindingHandlers["refreshScroll"] = {
    update: (element: HTMLElement, valueAccessor: () => any) => {
        valueAccessor();
        const iScroll: any = ko.utils.domData.get(element, "scroll");
        if (!iScroll) return;
        window.setTimeout(() => iScroll.refresh(), 0);
    }
};