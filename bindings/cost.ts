ko.bindingHandlers["cost"] = {
    update(element: HTMLElement, valueAccessor: () => string) {
        if (typeof valueAccessor() != "string") return;
        element.textContent = valueAccessor().replace(/(\d)(?=(\d{3})+[^\d])/g, "$1 ");
    }
};