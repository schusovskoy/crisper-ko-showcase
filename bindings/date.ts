ko.bindingHandlers["date"] = {
    update(element: HTMLElement, valueAccessor: () => string) {
        try {
            const date = new Date(parseInt(valueAccessor()));
            const day = ("0" + date.getDate()).substr(-2);
            const month = ("0" + (date.getMonth() + 1)).substr(-2);
            element.textContent = `${day}.${month}.${date.getFullYear()}`;
        } catch (ex) {
            const date = new Date();
            const day = ("0" + date.getDate()).substr(-2);
            const month = ("0" + (date.getMonth() + 1)).substr(-2);
            element.textContent = `${day}.${month}.${date.getFullYear()}`;
        }
    }
};