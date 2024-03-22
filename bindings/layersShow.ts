ko.bindingHandlers["layersShow"] = {
    update(element: HTMLElement, valueAccessor: () => string) {
        const map: L.Map = ko.utils.domData.get(element, "map");
        map.eachLayer(layer => !(layer instanceof L.TileLayer) && map.removeLayer(layer));
        const layer: L.ILayer = ko.utils.domData.get(element, valueAccessor());
        if (layer) map.addLayer(layer);
    }
};