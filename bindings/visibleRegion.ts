ko.bindingHandlers["visibleRegion"] = {
    init(element: HTMLElement, valueAccessor: () => { setPolygon(bounds: L.LatLngBounds): void }) {
        const map: L.Map = ko.utils.domData.get(element, "map");
        map.addEventListener("moveend", () => valueAccessor().setPolygon(map.getBounds()));
    }
};