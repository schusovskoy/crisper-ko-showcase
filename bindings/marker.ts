ko.bindingHandlers["marker"] = {
    init(element: HTMLElement, valueAccessor: () => { coordinate: { coordinates: Array<number> } | KnockoutObservable<{ coordinates: Array<number> }>,
        zoom: number | KnockoutObservable<number> }) {
        ko.utils.domData.set(element, "update", true);
        ko.utils.domData.set(element, "move", true);
        
        const marker: L.Marker = L.marker([0.0, 0.0], {
            icon: L.divIcon({ className: "marker-icon", iconSize: [42, 55], iconAnchor: [21, 55] })
        });
        ko.utils.domData.set(element, "marker", marker);
        
        const map: L.Map = ko.utils.domData.get(element, "map");
        map.addEventListener("moveend", event => {
            if (!ko.utils.domData.get(element, "move")) {
                ko.utils.domData.set(element, "move", true);
                return;
            }
            
            if (ko.isObservable(valueAccessor().zoom)) {
                ko.utils.domData.set(element, "update", false);
                (<KnockoutObservable<number>>valueAccessor().zoom)(map.getZoom());
            }
            if (ko.isObservable(valueAccessor().coordinate)) {
                ko.utils.domData.set(element, "update", false);
                (<KnockoutObservable<{ coordinates: Array<number> }>>valueAccessor()
                    .coordinate)({ coordinates: [map.getCenter().lat, map.getCenter().lng] });
            }
        });
    },
    update(element: HTMLElement, valueAccessor: () => { coordinate: { coordinates: Array<number> } | KnockoutObservable<{ coordinates: Array<number> }>,
        zoom: number | KnockoutObservable<number> }) {
        const map: L.Map = ko.utils.domData.get(element, "map");
        const marker: L.Marker = ko.utils.domData.get(element, "marker");
        const zoom: number = ko.unwrap(valueAccessor().zoom);
        const coordinate: { coordinates: Array<number> } = ko.unwrap(valueAccessor().coordinate);
    
        if (!ko.utils.domData.get(element, "update")) {
            ko.utils.domData.set(element, "update", true);
            return;
        }
        ko.utils.domData.set(element, "move", false);
        
        if (coordinate) {
            marker.setLatLng(coordinate.coordinates);
            map.setView(marker.getLatLng(), zoom, { animate: false });
        } else {
            marker.setLatLng([0.0, 0.0]);
        }
    }
};