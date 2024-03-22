import { IREObject } from "../models/entities/interfaces/IREObject";
import { popup } from "../views/map/popup";

ko.bindingHandlers["markers"] = {
    init(element: HTMLElement) {
        const markers: L.MarkerClusterGroup = new L.MarkerClusterGroup();
        ko.utils.domData.set(element, "markers", markers);
    },
    update(element: HTMLElement, valueAccessor: () => KnockoutObservableArray<IREObject>,
           allBindings: KnockoutAllBindingsAccessor, viewModel: any, bindingContext: KnockoutBindingContext) {
        const objects: Array<IREObject> = valueAccessor()();
        const markers: L.MarkerClusterGroup = ko.utils.domData.get(element, "markers");
        markers.clearLayers();
        objects.forEach(object => {
            const popupElement: HTMLElement = $(popup)[0];
            ko.applyBindings(bindingContext.createChildContext(object), popupElement);
            
            const marker: L.Marker = L.marker(object.coordinate.coordinates, {
                icon: L.divIcon({ className: "marker-icon", iconSize: [42, 55], iconAnchor: [21, 55] })
            }).bindPopup(popupElement, {
                closeButton: false,
                offset: L.point(0, 4),
                autoPan: false,
                className: "map__popup"
            })
                .addEventListener("popupopen", event => ko.utils.domData.set(element, "visiblePopup", object.id))
                .addEventListener("popupclose", event => {
                    if (!event.target["_icon"]) return;
                    ko.utils.domData.set(element, "visiblePopup", null)
                });
            markers.addLayer(marker);
            if (object.id == ko.utils.domData.get(element, "visiblePopup")) marker.openPopup();
        });
    }
};