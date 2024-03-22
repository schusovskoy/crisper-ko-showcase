ko.bindingHandlers["phone"] = {
    update(element: HTMLElement, valueAccessor: () => string) {
        element.textContent = valueAccessor().replace(/(\d{3})(\d{3})(\d{2})(\d{2})/, "+7 ($1) $2-$3-$4");
    }
};