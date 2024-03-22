ko.bindingHandlers["map"] = {
    init(element: HTMLElement) {
        const map: L.Map = L.map(element)
            .addLayer(L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            }));
        map.setView([45.0534624, 39.0759726], 11, { animate: false });
        ko.utils.domData.set(element, "map", map);
    }
};