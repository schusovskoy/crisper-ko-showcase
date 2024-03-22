ko.bindingHandlers["scroll"] = {
    init: (element: HTMLElement, valueAccessor: () => number, allBindings: KnockoutAllBindingsAccessor) => {
        window.setTimeout(() => {
            const iScroll: any = new window["IScroll"](element, {
                mouseWheel: true,
                disableMouse: true,
                scrollbars: "custom",
                probeType: 2,
                interactiveScrollbars: true
            });
            
            if (valueAccessor()) window.setInterval(() => iScroll.refresh(), valueAccessor());
            if (typeof allBindings.get("lazy") == "function") {
                const offset: number = allBindings.get("lazyOffset") ? allBindings.get("lazyOffset") : 0;
                let isEnd: boolean = false;
                iScroll.on("scroll", () => {
                    if (iScroll.y <= iScroll.maxScrollY + offset && !isEnd) {
                        isEnd = true;
                        allBindings.get("lazy")();
                    } else if (iScroll.y > iScroll.maxScrollY + offset && isEnd)
                        isEnd = false;
                });
            }
            ko.utils.domData.set(element, "scroll", iScroll);
        }, 1000);
    }
};