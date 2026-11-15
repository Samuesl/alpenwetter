/* Wetterstationen Euregio Beispiel */

// Innsbruck
let ibk = {
    lat: 47.5798,
    lng: 9.6789,
    zoom: 11,
};
const maxStationAge = 90 * 60 * 1000;
const maxSavedFavorites = 4;
const favoriteStorageKey = "alpenwetter-favorites";
const regionalFallbackMaxDistance = 25000;
const bodenseeOberschwabenBounds = {
    south: 47.4,
    north: 48.2,
    west: 9.0,
    east: 10.15,
};
const geoSphereApi = "https://dataset.api.hub.geosphere.at/v1/station/current/tawes-v1-10min";
const meteoSwissStacSearch = "https://data.geo.admin.ch/api/stac/v1/search";
const meteoSwissCollection = "ch.meteoschweiz.ogd-smn";
const brightSkyCurrentWeather = "https://api.brightsky.dev/current_weather";
const germanAlpineCoverageLocations = [
    { name: "Lindau", lat: 47.55, lon: 9.69 },
    { name: "Oberstdorf", lat: 47.41, lon: 10.28 },
    { name: "Füssen", lat: 47.57, lon: 10.70 },
    { name: "Kempten", lat: 47.73, lon: 10.32 },
    { name: "Kaufbeuren", lat: 47.88, lon: 10.62 },
    { name: "Memmingen", lat: 47.98, lon: 10.18 },
    { name: "Mindelheim", lat: 48.05, lon: 10.49 },
    { name: "Augsburg", lat: 48.37, lon: 10.90 },
    { name: "Donauwörth", lat: 48.72, lon: 10.78 },
    { name: "Nördlingen", lat: 48.85, lon: 10.49 },
    { name: "Dillingen", lat: 48.58, lon: 10.49 },
    { name: "Günzburg", lat: 48.46, lon: 10.28 },
    { name: "Krumbach", lat: 48.25, lon: 10.36 },
    { name: "Landsberg am Lech", lat: 48.05, lon: 10.87 },
    { name: "Schongau", lat: 47.82, lon: 10.90 },
    { name: "Garmisch-Partenkirchen", lat: 47.49, lon: 11.10 },
    { name: "Weilheim", lat: 47.84, lon: 11.14 },
    { name: "Bad Tölz", lat: 47.76, lon: 11.56 },
    { name: "Miesbach", lat: 47.79, lon: 11.83 },
    { name: "Rosenheim", lat: 47.85, lon: 12.13 },
    { name: "Traunstein", lat: 47.87, lon: 12.65 },
    { name: "Berchtesgaden", lat: 47.63, lon: 13.00 },
    { name: "Ingolstadt", lat: 48.77, lon: 11.43 },
    { name: "Neuburg an der Donau", lat: 48.73, lon: 11.18 },
    { name: "Pfaffenhofen", lat: 48.53, lon: 11.51 },
    { name: "Freising", lat: 48.40, lon: 11.75 },
    { name: "Erding", lat: 48.31, lon: 11.91 },
    { name: "München", lat: 48.14, lon: 11.58 },
    { name: "Dachau", lat: 48.26, lon: 11.43 },
    { name: "Fürstenfeldbruck", lat: 48.18, lon: 11.25 },
    { name: "Ebersberg", lat: 48.08, lon: 11.97 },
    { name: "Mühldorf am Inn", lat: 48.25, lon: 12.52 },
    { name: "Altötting", lat: 48.23, lon: 12.68 },
    { name: "Wasserburg am Inn", lat: 48.06, lon: 12.23 },
    { name: "Simbach am Inn", lat: 48.27, lon: 13.02 },
    { name: "Passau", lat: 48.57, lon: 13.46 },
    { name: "Konstanz", lat: 47.66, lon: 9.18 },
    { name: "Überlingen", lat: 47.77, lon: 9.16 },
    { name: "Friedrichshafen", lat: 47.65, lon: 9.48 },
    { name: "Markdorf", lat: 47.72, lon: 9.39 },
    { name: "Ravensburg", lat: 47.78, lon: 9.61 },
    { name: "Bad Waldsee", lat: 47.92, lon: 9.75 },
    { name: "Leutkirch", lat: 47.83, lon: 10.02 },
    { name: "Wangen im Allgäu", lat: 47.69, lon: 9.83 },
    { name: "Oberstaufen", lat: 47.56, lon: 10.02 },
    { name: "Immenstadt", lat: 47.56, lon: 10.22 },
    { name: "Balderschwang", lat: 47.46, lon: 10.10 },
    { name: "Wertach", lat: 47.60, lon: 10.41 },
    { name: "Oberammergau", lat: 47.60, lon: 11.07 },
    { name: "Mittenwald", lat: 47.44, lon: 11.26 },
    { name: "Aulendorf", lat: 47.95, lon: 9.64 },
    { name: "Riedlingen", lat: 48.15, lon: 9.48 },
    { name: "Biberach an der Riß", lat: 48.10, lon: 9.79 },
    { name: "Deggenhausertal", lat: 47.80, lon: 9.41 },
    { name: "Sigmarszell-Zeisertsweiler", lat: 47.5776, lon: 9.74045 },
    { name: "Rot an der Rot", lat: 47.9589, lon: 10.0139 },
];

function loadSavedFavorites() {
    try {
        let storedFavorites = localStorage.getItem(favoriteStorageKey);
        if (!storedFavorites) {
            return [];
        }

        let parsedFavorites = JSON.parse(storedFavorites);
        if (!Array.isArray(parsedFavorites)) {
            throw new Error("Favoriten müssen als Liste gespeichert sein.");
        }

        let validFavorites = parsedFavorites.filter(favorite =>
            favorite &&
            (typeof favorite.id === "string" || Number.isFinite(favorite.id)) &&
            typeof favorite.name === "string" &&
            Number.isFinite(favorite.lat) && favorite.lat >= -90 && favorite.lat <= 90 &&
            Number.isFinite(favorite.lng) && favorite.lng >= -180 && favorite.lng <= 180
        );
        return validFavorites.filter((favorite, index) =>
            validFavorites.findIndex(candidate => candidate.id === favorite.id) === index
        ).slice(0, maxSavedFavorites);
    } catch (error) {
        console.error("Gespeicherte Favoriten konnten nicht geladen werden.", error);
        return [];
    }
}

let favorites = loadSavedFavorites();
let stationLayersById = new Map();
let stationDataReady;

// Karte initialisierenn
let map = L.map("map", { maxZoom: 18, zoomControl: false }).setView([ibk.lat, ibk.lng], ibk.zoom);

// Persönlicher Bild-Pin in Lindau, unabhängig von den Wetter-Layern.
function addLindauPicturePin() {
    let location = germanAlpineCoverageLocations.find(place => place.name === "Lindau");
    let content = document.createElement("figure");
    content.className = "lindau-picture";
    let title = document.createElement("h3");
    title.textContent = "swain";
    let picture = document.createElement("img");
    picture.src = "icons/lindau-jolly.jpg";
    picture.alt = "Weißes NICI-Plüschschaf mit bunten Blumen";
    picture.width = 349;
    picture.height = 440;
    let caption = document.createElement("figcaption");
    let source = document.createElement("a");
    source.href = "https://image.ceneostatic.pl/data/products/5750053/i-nici-jolly-lovely-25-cm-488-2031494.jpg";
    source.textContent = "Bildquelle: Ceneo";
    source.target = "_blank";
    source.rel = "noopener noreferrer";
    caption.append(source);
    content.append(title, picture, caption);

    let pin = L.marker([location.lat, location.lon], {
        title: "swain – Bild ansehen",
        zIndexOffset: 500,
        icon: L.divIcon({
            className: "lindau-picture-pin",
            html: '<span class="lindau-pig-nose" aria-hidden="true"><span></span><span></span></span>',
            iconSize: [44, 44],
            iconAnchor: [22, 22],
            popupAnchor: [0, -22],
        }),
    }).bindPopup(content, { className: "lindau-picture-popup", minWidth: 180, maxWidth: 230 }).addTo(map);
    picture.addEventListener("load", function () {
        if (pin.isPopupOpen()) pin.getPopup().update();
    });
}
addLindauPicturePin();

// thematische Layer
let overlays = {
    stations: L.markerClusterGroup({
        maxClusterRadius: 60,
        disableClusteringAtZoom: 11,
        showCoverageOnHover: false,
        spiderfyOnMaxZoom: true,
        iconCreateFunction: function (cluster) {
            let count = cluster.getChildCount();
            let density = count >= 50 ? "high" : count >= 25 ? "medium" : count >= 10 ? "low" : "very-low";
            let size = count >= 50 ? 58 : count >= 25 ? 52 : count >= 10 ? 46 : 40;
            return L.divIcon({
                html: `<span>${count}</span>`,
                className: `station-cluster station-cluster-${density}`,
                iconSize: L.point(size, size),
            });
        },
    }).addTo(map),
    temperature: L.featureGroup(),
    humidity: L.featureGroup(),
    wind: L.featureGroup(),
    snow: L.featureGroup(),
    direction: L.featureGroup(),
}

// Layer control
let layerControl = L.control.layers({
    "Relief avalanche.report": L.tileLayer(
        "https://static.avalanche.report/tms/{z}/{x}/{y}.webp", {
        attribution: `© <a href="https://sonny.4lima.de">Sonny</a>, <a href="https://www.eea.europa.eu/en/datahub/datahubitem-view/d08852bc-7b5f-4835-a776-08362e2fbf4b">EU-DEM</a>, <a href="https://lawinen.report/">avalanche.report</a>, all licensed under <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>`,
        maxZoom: 12
    }),
    "OpenStreetMap": L.tileLayer.provider("OpenStreetMap.Mapnik").addTo(map),
    "OpenTopoMap": L.tileLayer.provider("OpenTopoMap"),
    "Esri WorldImagery": L.tileLayer.provider("Esri.WorldImagery"),
}, {
    "Wetterstationen": overlays.stations,
    "Temperatur (°C)": overlays.temperature,
    "Luftfeuchtigkeit (%)": overlays.humidity,
    "Windgeschwindigkeit (km/h)": overlays.wind,
    "Schneehöhe (cm)": overlays.snow,
    "Windrichtung": overlays.direction,
}).addTo(map);

for (let input of layerControl.getContainer().querySelectorAll('input[type="checkbox"]')) {
    input.type = "radio";
    input.name = "weather-overlay";
}

let weatherOverlays = Object.values(overlays);
map.on("overlayadd", function (event) {
    for (let overlay of weatherOverlays) {
        if (overlay !== event.layer && map.hasLayer(overlay)) {
            map.removeLayer(overlay);
        }
    }
});

// Maßstab
L.control.scale({
    imperial: false,
}).addTo(map);

L.control.zoom({
    position: "bottomleft",
}).addTo(map);

let dataSourcesControl = L.control({ position: "bottomright" });
dataSourcesControl.onAdd = function () {
    let container = L.DomUtil.create("div", "data-sources-control");
    let button = L.DomUtil.create("button", "data-sources-button", container);
    button.type = "button";
    button.innerHTML = '<i class="fa-solid fa-circle-info" aria-hidden="true"></i> Datenquellen';
    button.setAttribute("aria-haspopup", "dialog");
    button.setAttribute("aria-controls", "data-sources-dialog");
    let dialog = document.querySelector("#data-sources-dialog");
    button.addEventListener("click", function () {
        if (!dialog.open) dialog.showModal();
    });
    dialog.querySelector(".data-sources-close").addEventListener("click", function () {
        dialog.close();
    });
    dialog.addEventListener("close", function () {
        button.focus({ preventScroll: true });
    });
    dialog.addEventListener("click", function (event) {
        if (event.target !== dialog) return;
        let bounds = dialog.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right ||
            event.clientY < bounds.top || event.clientY > bounds.bottom) {
            dialog.close();
        }
    });
    L.DomEvent.disableClickPropagation(container);
    L.DomEvent.disableScrollPropagation(container);
    return container;
};
dataSourcesControl.addTo(map);

function findNearestStation(latitude, longitude) {
    let nearest;
    for (let layer of stationLayersById.values()) {
        let position = layer.getLatLng();
        if (!Number.isFinite(position.lat) || !Number.isFinite(position.lng)) continue;
        let distance = distanceBetweenStations([longitude, latitude], [position.lng, position.lat]);
        if (Number.isFinite(distance) && (!nearest || distance < nearest.distance)) {
            nearest = { layer, distance };
        }
    }
    return nearest;
}

let userLocationLayers = L.layerGroup().addTo(map);
let locationControl = L.control({ position: "bottomleft" });
locationControl.onAdd = function () {
    let container = L.DomUtil.create("div", "location-control");
    container.innerHTML = `
        <button type="button" class="location-button" aria-label="Standort und nächste Wetterstation finden" title="Standort und nächste Wetterstation finden">
            <i class="fa-solid fa-crosshairs" aria-hidden="true"></i>
        </button>
        <div class="location-status" role="status" aria-live="polite"></div>
    `;
    L.DomEvent.disableClickPropagation(container);
    L.DomEvent.disableScrollPropagation(container);

    let button = container.querySelector("button");
    let icon = button.querySelector("i");
    let status = container.querySelector(".location-status");
    function finishLocationRequest(message) {
        button.disabled = false;
        button.removeAttribute("aria-busy");
        icon.classList.remove("fa-spin");
        status.textContent = message;
    }

    button.addEventListener("click", function () {
        if (!window.isSecureContext) {
            status.textContent = "Standortzugriff benötigt HTTPS oder eine lokale Vorschau über localhost.";
            return;
        }
        if (!navigator.geolocation) {
            status.textContent = "Dieser Browser unterstützt keine Standortabfrage.";
            return;
        }

        button.disabled = true;
        button.setAttribute("aria-busy", "true");
        icon.classList.add("fa-spin");
        status.textContent = "Standort wird ermittelt …";
        try {
            navigator.geolocation.getCurrentPosition(async function (position) {
                let { latitude, longitude, accuracy } = position.coords;
                if (!Number.isFinite(latitude) || !Number.isFinite(longitude) ||
                    latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180 ||
                    !Number.isFinite(accuracy) || accuracy < 0) {
                    finishLocationRequest("Der Browser hat keinen gültigen Standort geliefert.");
                    return;
                }

                userLocationLayers.clearLayers();
                let coordinates = [latitude, longitude];
                let accuracyCircle = L.circle(coordinates, {
                    radius: accuracy,
                    color: "#168fe5",
                    weight: 1,
                    fillColor: "#168fe5",
                    fillOpacity: 0.12,
                    interactive: false,
                }).addTo(userLocationLayers);
                let locationLabel = document.createElement("span");
                locationLabel.textContent = `Dein Standort · Genauigkeit ca. ${Math.ceil(accuracy)} m`;
                L.circleMarker(coordinates, {
                    radius: 8,
                    color: "#fff",
                    weight: 3,
                    fillColor: "#168fe5",
                    fillOpacity: 1,
                }).bindPopup(locationLabel).addTo(userLocationLayers);
                map.closePopup();
                status.textContent = "Standort gefunden · Suche nächste Wetterstation …";
                let stationWaitTimer;
                try {
                    await Promise.race([
                        stationDataReady,
                        new Promise(resolve => { stationWaitTimer = setTimeout(resolve, 15000); }),
                    ]);
                } finally {
                    clearTimeout(stationWaitTimer);
                }
                let nearest = findNearestStation(latitude, longitude);
                if (nearest) {
                    map.addLayer(overlays.stations);
                    let stationPosition = nearest.layer.getLatLng();
                    let nearestMarker = bindStationPopup(L.circleMarker(stationPosition, {
                        radius: 15,
                        color: "#d39700",
                        weight: 3,
                        fillColor: "#ffd54f",
                        fillOpacity: 0.15,
                    }), nearest.layer.feature).addTo(userLocationLayers);
                    let bounds = L.latLngBounds([coordinates, stationPosition]);
                    map.once("moveend", function () {
                        nearestMarker.openPopup();
                    });
                    map.flyToBounds(bounds, { maxZoom: 14, padding: [50, 50] });
                    let distanceText = nearest.distance < 1000
                        ? `${Math.round(nearest.distance)} m`
                        : `${(nearest.distance / 1000).toLocaleString("de-DE", { maximumFractionDigits: 1 })} km`;
                    let stationName = nearest.layer.feature?.properties?.name ?? "Wetterstation";
                    finishLocationRequest(`Nächste Station: ${stationName} · ${distanceText} Luftlinie. Standortgenauigkeit ca. ${Math.ceil(accuracy)} m.`);
                    return;
                }
                if (accuracy > 0) {
                    map.flyToBounds(accuracyCircle.getBounds(), { maxZoom: 14, padding: [30, 30] });
                } else {
                    map.flyTo(coordinates, 14);
                }
                finishLocationRequest("Standort gefunden. Noch keine Wetterstationen verfügbar – bitte später erneut auf den Standortbutton tippen.");
            }, function (error) {
                let messages = {
                    1: "Standortzugriff nicht erlaubt. Du kannst ihn in den Website-Berechtigungen deines Browsers aktivieren.",
                    2: "Dein Standort ist momentan nicht verfügbar. Bitte versuche es erneut.",
                    3: "Die Standortsuche hat zu lange gedauert. Bitte versuche es erneut.",
                };
                finishLocationRequest(messages[error.code] ?? "Der Standort konnte nicht ermittelt werden.");
            }, {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 60000,
            });
        } catch (error) {
            finishLocationRequest("Die Standortabfrage konnte nicht gestartet werden.");
        }
    });
    return container;
};
locationControl.addTo(map);

let lastPlaceSearchAt = 0;
let placeSearchControl = L.control({ position: "topleft" });
placeSearchControl.onAdd = function () {
    let container = L.DomUtil.create("div", "place-search-control leaflet-bar");
    container.innerHTML = `
        <details class="place-search-panel" open>
        <summary aria-label="Ortssuche öffnen oder schließen" title="Ort suchen">
            <i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
        </summary>
        <div class="place-search-content">
        <form class="place-search-form" role="search">
            <label class="visually-hidden" for="place-search-input">Ort suchen</label>
            <input id="place-search-input" type="search" placeholder="Ort suchen…" autocomplete="off" required>
            <button type="submit" aria-label="Ort suchen" title="Ort suchen">
                <i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
            </button>
        </form>
        <div class="place-search-message" role="status" aria-live="polite"></div>
        <small class="place-search-attribution">Ortsdaten: <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">© OpenStreetMap</a></small>
        </div>
        </details>
    `;
    L.DomEvent.disableClickPropagation(container);
    L.DomEvent.disableScrollPropagation(container);

    let form = container.querySelector("form");
    let input = container.querySelector("input");
    let button = container.querySelector("button");
    let message = container.querySelector(".place-search-message");
    let panel = container.querySelector("details");
    let mobileLayout = window.matchMedia("(max-width: 600px)");
    function updateSearchLayout() {
        panel.open = !mobileLayout.matches;
    }
    updateSearchLayout();
    mobileLayout.addEventListener("change", updateSearchLayout);
    function closeSearchOutside(event) {
        if (mobileLayout.matches && panel.open && !container.contains(event.target)) {
            panel.open = false;
            input.blur();
        }
    }
    document.addEventListener("pointerdown", closeSearchOutside, true);
    document.addEventListener("click", closeSearchOutside, true);
    panel.addEventListener("toggle", function () {
        if (panel.open && mobileLayout.matches) {
            favoritesControl.getContainer().querySelector("details").open = false;
            layerControl.collapse();
            input.focus({ preventScroll: true });
        }
    });
    input.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && mobileLayout.matches) {
            panel.open = false;
            panel.querySelector("summary").focus();
        }
    });
    form.addEventListener("submit", async function (event) {
        event.preventDefault();
        let query = input.value.trim();
        if (!query) {
            return;
        }
        let timeSinceLastSearch = Date.now() - lastPlaceSearchAt;
        if (timeSinceLastSearch < 1000) {
            message.textContent = "Bitte vor der nächsten Suche kurz warten.";
            return;
        }

        lastPlaceSearchAt = Date.now();
        button.disabled = true;
        input.disabled = true;
        message.textContent = "Suche läuft …";
        try {
            let url = new URL("https://nominatim.openstreetmap.org/search");
            url.searchParams.set("format", "jsonv2");
            url.searchParams.set("limit", "1");
            url.searchParams.set("accept-language", "de");
            url.searchParams.set("q", query);
            let response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Ortsuche fehlgeschlagen (${response.status})`);
            }
            let results = await response.json();
            let latitude = Number(results[0]?.lat);
            let longitude = Number(results[0]?.lon);
            if (!Number.isFinite(latitude) || !Number.isFinite(longitude) ||
                latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
                message.textContent = "Kein passender Ort gefunden.";
                return;
            }

            map.addLayer(overlays.stations);
            map.flyTo([latitude, longitude], 12);
            message.textContent = results[0].display_name;
            if (mobileLayout.matches) {
                input.blur();
                panel.open = false;
            }
        } catch (error) {
            console.error("Die Ortsuche konnte nicht ausgeführt werden.", error);
            message.textContent = "Ortsuche momentan nicht verfügbar.";
        } finally {
            button.disabled = false;
            input.disabled = false;
        }
    });

    return container;
};
placeSearchControl.addTo(map);

let favoritesControl = L.control({ position: "topright" });
favoritesControl.onAdd = function () {
    let container = L.DomUtil.create("div", "favorites-map-control");
    container.innerHTML = `
        <details class="favorites-menu">
            <summary aria-label="Favoriten öffnen oder schließen" title="Favoriten">
                <i class="fa-solid fa-star" aria-hidden="true"></i>
                <span class="favorites-button-label">Favoriten · <span class="favorites-count">0</span></span>
            </summary>
        </details>
    `;
    container.querySelector("details").append(document.querySelector("#favorites-bar"));
    L.DomEvent.disableClickPropagation(container);
    L.DomEvent.disableScrollPropagation(container);
    return container;
};
favoritesControl.addTo(map);

function closeFavoritesOutside(event) {
    let container = favoritesControl.getContainer();
    if (!container.contains(event.target)) {
        container.querySelector("details").open = false;
    }
}

// Auch Klicks auf Kartenbedienelemente erfassen, die Ereignisse nicht weiterreichen.
document.addEventListener("pointerdown", closeFavoritesOutside, true);
document.addEventListener("click", closeFavoritesOutside, true);

favoritesControl.getContainer().querySelector("details").addEventListener("toggle", function (event) {
    if (event.target.open && window.matchMedia("(max-width: 600px)").matches) {
        placeSearchControl.getContainer().querySelector("details").open = false;
        layerControl.collapse();
    }
});
layerControl.getContainer().addEventListener("click", function () {
    if (window.matchMedia("(max-width: 600px)").matches) {
        placeSearchControl.getContainer().querySelector("details").open = false;
        favoritesControl.getContainer().querySelector("details").open = false;
    }
});

function setFavoritesStatus(message) {
    document.querySelector(".favorites-status").textContent = message;
    if (message) {
        favoritesControl.getContainer().querySelector("details").open = true;
    }
}

function renderFavorites() {
    let favoritesBar = document.querySelector("#favorites-bar");
    let favoritesList = favoritesBar.querySelector(".favorites-list");
    favoritesList.textContent = "";
    favoritesBar.querySelector(".favorites-empty").hidden = favorites.length > 0;
    favoritesControl.getContainer().querySelector(".favorites-count").textContent = favorites.length;

    favorites.forEach((favorite, index) => {
        let item = document.createElement("div");
        item.className = "favorite-item";

        let locationButton = document.createElement("button");
        locationButton.type = "button";
        locationButton.className = "favorite-location";
        locationButton.dataset.favoriteIndex = index;
        locationButton.title = favorite.name;
        locationButton.setAttribute("aria-label", `Zu ${favorite.name} fliegen`);

        let label = document.createElement("span");
        label.textContent = favorite.name;
        locationButton.append(label);

        let removeButton = document.createElement("button");
        removeButton.type = "button";
        removeButton.className = "favorite-remove";
        removeButton.dataset.removeFavoriteIndex = index;
        removeButton.title = `${favorite.name} aus Favoriten entfernen`;
        removeButton.setAttribute("aria-label", removeButton.title);
        let removeIcon = document.createElement("i");
        removeIcon.className = "fa-solid fa-star";
        removeIcon.setAttribute("aria-hidden", "true");
        removeButton.append(removeIcon);

        item.append(locationButton, removeButton);
        favoritesList.append(item);
    });

    for (let button of document.querySelectorAll(".station-favorite-toggle[data-station-id]")) {
        setFavoriteButtonState(
            button,
            favorites.some(favorite => String(favorite.id) === button.dataset.stationId),
        );
    }
}

function saveFavorites(nextFavorites) {
    try {
        localStorage.setItem(favoriteStorageKey, JSON.stringify(nextFavorites));
    } catch (error) {
        console.error("Favoriten konnten nicht gespeichert werden.", error);
        setFavoritesStatus("Favoriten konnten nicht gespeichert werden.");
        return false;
    }

    favorites = nextFavorites;
    renderFavorites();
    return true;
}

function setFavoriteButtonState(button, isFavorite) {
    button.classList.toggle("is-favorite", isFavorite);
    button.setAttribute("aria-pressed", String(isFavorite));
    button.setAttribute("aria-label", isFavorite ? "Favorit entfernen" : "Als Favorit speichern");
    button.title = isFavorite ? "Favorit entfernen" : "Als Favorit speichern";
    button.querySelector("i").className = isFavorite ? "fa-solid fa-star" : "fa-regular fa-star";
}

function toggleStationFavorite(feature) {
    let favoriteIndex = favorites.findIndex(favorite => favorite.id === feature.id);
    if (favoriteIndex >= 0) {
        let nextFavorites = favorites.filter((favorite, index) => index !== favoriteIndex);
        if (saveFavorites(nextFavorites)) {
            setFavoritesStatus(`${feature.properties.name} aus Favoriten entfernt.`);
        }
        return;
    }

    if (favorites.length >= maxSavedFavorites) {
        setFavoritesStatus("Es sind bereits vier Favoriten gespeichert. Entferne zuerst einen.");
        return;
    }

    let [lng, lat] = feature.geometry.coordinates;
    let nextFavorites = [...favorites, {
        id: feature.id,
        name: feature.properties.name,
        lat,
        lng,
    }];
    if (saveFavorites(nextFavorites)) {
        setFavoritesStatus(`${feature.properties.name} zu Favoriten hinzugefügt.`);
    }
}

function flyToFavorite(favorite) {
    setFavoritesStatus("");
    favoritesControl.getContainer().querySelector("details").open = false;
    map.addLayer(overlays.stations);
    map.closePopup();
    map.once("moveend", function () {
        let stationLayer = stationLayersById.get(favorite.id);
        if (stationLayer) {
            stationLayer.openPopup();
        }
    });
    map.flyTo([favorite.lat, favorite.lng], 12);
}

let favoritesBar = document.querySelector("#favorites-bar");
favoritesBar.addEventListener("click", function (event) {
    let removeButton = event.target.closest("[data-remove-favorite-index]");
    if (removeButton) {
        let index = Number(removeButton.dataset.removeFavoriteIndex);
        let favorite = favorites[index];
        if (!favorite) {
            return;
        }
        if (saveFavorites(favorites.filter((entry, entryIndex) => entryIndex !== index))) {
            setFavoritesStatus(`${favorite.name} aus Favoriten entfernt.`);
        }
        return;
    }

    let locationButton = event.target.closest("[data-favorite-index]");
    if (locationButton) {
        let favorite = favorites[Number(locationButton.dataset.favoriteIndex)];
        if (favorite) {
            flyToFavorite(favorite);
        }
    }
});
renderFavorites();

/*
// RainViewer-Regensteuerung, aktuell deaktiviert.
L.control.rainviewer({
    position: 'bottomleft',
    nextButtonText: '>',
    playStopButtonText: 'Play/Stop',
    prevButtonText: '<',
    positionSliderLabelText: "Hour:",
    opacitySliderLabelText: "Opacity:",
    animationInterval: 500,
    opacity: 0.5
}).addTo(map);
*/

//Wetterstationen mit Icons und Popups
async function loadStationData(url) {
    let response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Wetterstationen konnten nicht geladen werden: ${url} (${response.status})`);
    }
    return response.json();
}

function normalizeStation(feature, isAdditionalFeed) {
    let properties = feature.properties;
    let temperature = properties.LT ?? (properties.TA !== undefined ? properties.TA - 273.15 : undefined);
    let windSpeed = properties.WG ?? (properties.VW !== undefined ? properties.VW * 3.6 : undefined);
    let snowDepth = properties.HS;
    let relativeHumidity = properties.RH;

    if (isAdditionalFeed) {
        if (snowDepth !== undefined) {
            snowDepth *= 100;
        }
        if (relativeHumidity !== undefined && relativeHumidity <= 1) {
            relativeHumidity *= 100;
        }
    }

    return {
        ...feature,
        properties: {
            ...properties,
            LT: temperature,
            WG: windSpeed,
            HS: snowDepth,
            RH: relativeHumidity,
            WR: properties.WR ?? properties.DW,
        },
    };
}

function isValidMeasurement(value) {
    return typeof value === "number" && Number.isFinite(value) &&
        value !== -999 && value !== -777;
}

function mergeStationFeatures(existingFeature, incomingFeature) {
    let existingTimestamp = Date.parse(existingFeature.properties.date);
    let incomingTimestamp = Date.parse(incomingFeature.properties.date);
    let incomingIsNewer = Number.isFinite(incomingTimestamp) &&
        (!Number.isFinite(existingTimestamp) || incomingTimestamp > existingTimestamp);
    let preferredFeature = incomingIsNewer ? incomingFeature : existingFeature;
    let secondaryFeature = incomingIsNewer ? existingFeature : incomingFeature;
    let properties = {
        ...secondaryFeature.properties,
        ...preferredFeature.properties,
    };

    for (let measurement of ["LT", "RH", "PR", "WG", "WR", "HS", "RS"]) {
        let preferredValue = preferredFeature.properties[measurement];
        let secondaryValue = secondaryFeature.properties[measurement];
        if (!isValidMeasurement(preferredValue) && isValidMeasurement(secondaryValue)) {
            properties[measurement] = secondaryValue;
        }
    }

    return {
        ...preferredFeature,
        properties,
    };
}

function addNewestStation(featuresById, feature, isAdditionalFeed) {
    let normalizedFeature = normalizeStation(feature, isAdditionalFeed);
    addStationFeature(featuresById, normalizedFeature);
}

function addStationFeature(featuresById, feature) {
    let [longitude, latitude] = feature.geometry.coordinates;
    let nearbyEntries = [...featuresById.entries()].filter(([id, existingFeature]) => {
        if (id === feature.id) {
            return true;
        }
        let [existingLongitude, existingLatitude] = existingFeature.geometry.coordinates;
        let eastWestDistance = (longitude - existingLongitude) * 111320 * Math.cos(latitude * Math.PI / 180);
        let northSouthDistance = (latitude - existingLatitude) * 111320;
        return Math.hypot(eastWestDistance, northSouthDistance) < 100;
    });

    let mergedFeature = feature;
    for (let [id, nearbyFeature] of nearbyEntries) {
        mergedFeature = mergeStationFeatures(nearbyFeature, mergedFeature);
        featuresById.delete(id);
    }
    featuresById.set(mergedFeature.id, mergedFeature);
}

function addNewestLiveStation(featuresById, feature) {
    addStationFeature(featuresById, feature);
}

async function loadGeoSphereStations() {
    let metadata = await loadStationData(`${geoSphereApi}/metadata`);
    let activeStations = metadata.stations.filter(station => station.is_active);
    let url = new URL(geoSphereApi);
    url.searchParams.set("parameters", "TL,RF,FF,DD,SCHNEE");
    url.searchParams.set("station_ids", activeStations.map(station => station.id).join(","));
    let data = await loadStationData(url);
    let stationsById = new Map(activeStations.map(station => [station.id, station]));
    let now = Date.now();

    return data.features.flatMap(feature => {
        let station = stationsById.get(feature.properties.station);
        if (!station) {
            return [];
        }

        let measurementIndex = -1;
        let timestamp;
        for (let index = data.timestamps.length - 1; index >= 0; index--) {
            let candidateTimestamp = Date.parse(data.timestamps[index]);
            let age = now - candidateTimestamp;
            if (!Number.isFinite(candidateTimestamp) || age < 0 || age > maxStationAge) {
                continue;
            }

            let hasValue = Object.values(feature.properties.parameters).some(parameter => {
                let value = parameter.data[index];
                return typeof value === "number" && Number.isFinite(value) && value !== -999 && value !== -777;
            });
            if (hasValue) {
                measurementIndex = index;
                timestamp = new Date(candidateTimestamp).toISOString();
                break;
            }
        }
        if (measurementIndex < 0) {
            return [];
        }

        let getValue = parameter => {
            let value = feature.properties.parameters[parameter]?.data[measurementIndex];
            return typeof value === "number" && Number.isFinite(value) && value !== -999 && value !== -777
                ? value
                : undefined;
        };
        let windSpeed = getValue("FF");

        return [{
            type: "Feature",
            id: `geosphere-${station.id}`,
            geometry: {
                type: "Point",
                coordinates: [station.lon, station.lat, station.altitude],
            },
            properties: {
                name: station.name,
                operator: "GeoSphere Austria",
                operatorLink: "https://www.geosphere.at/",
                providerStationId: station.id,
                date: timestamp,
                LT: getValue("TL"),
                RH: getValue("RF"),
                WG: windSpeed === undefined ? undefined : windSpeed * 3.6,
                WR: getValue("DD"),
                HS: getValue("SCHNEE"),
            },
        }];
    });
}

async function loadBrightSkyStations() {
    let stationResults = await Promise.allSettled(germanAlpineCoverageLocations.map(async location => {
        let url = new URL(brightSkyCurrentWeather);
        url.searchParams.set("lat", location.lat);
        url.searchParams.set("lon", location.lon);
        url.searchParams.set("units", "dwd");
        let response = await fetch(url);
        if (!response.ok) {
            throw new Error(`${location.name}: ${response.status}`);
        }

        let data = await response.json();
        let weather = data.weather;
        if (!weather) {
            throw new Error(`${location.name}: Keine aktuellen Wetterdaten`);
        }
        let station = data.sources.find(source => source.id === weather.source_id);
        if (!station) {
            throw new Error(`${location.name}: Messstation fehlt in der Antwort`);
        }
        let getOwnMeasurement = (parameter, value) =>
            Number.isFinite(value) && !weather.fallback_source_ids?.[parameter] ? value : undefined;

        return {
            type: "Feature",
            id: `brightsky-${station.id}`,
            geometry: {
                type: "Point",
                coordinates: [station.lon, station.lat, station.height],
            },
            properties: {
                name: station.station_name,
                operator: "DWD via Bright Sky",
                operatorLink: "https://brightsky.dev/",
                providerStationId: station.id,
                dwdStationId: station.dwd_station_id,
                date: weather.timestamp,
                LT: getOwnMeasurement("temperature", weather.temperature),
                RH: getOwnMeasurement("relative_humidity", weather.relative_humidity),
                WG: getOwnMeasurement("wind_speed_10", weather.wind_speed_10),
                WR: getOwnMeasurement("wind_direction_10", weather.wind_direction_10),
                RS: getOwnMeasurement("solar_60", weather.solar_60),
            },
        };
    }));

    let failures = stationResults.filter(result => result.status === "rejected");
    if (failures.length) {
        console.warn(
            `${failures.length} Bright Sky-Abfragen für bayerische Grenzlandkreise sind fehlgeschlagen.`,
            stationResults.flatMap((result, index) => result.status === "rejected"
                ? [`${germanAlpineCoverageLocations[index].name}: ${result.reason}`]
                : [])
        );
    }
    return stationResults.flatMap(result =>
        result.status === "fulfilled" ? [result.value] : []
    );
}

function parseSemicolonCsvRow(row) {
    let values = [];
    let value = "";
    let quoted = false;

    for (let index = 0; index < row.length; index++) {
        let character = row[index];
        if (character === '"' && row[index + 1] === '"' && quoted) {
            value += '"';
            index++;
        } else if (character === '"') {
            quoted = !quoted;
        } else if (character === ";" && !quoted) {
            values.push(value);
            value = "";
        } else {
            value += character;
        }
    }
    values.push(value);
    return values;
}

function parseMeteoSwissTimestamp(value) {
    let match = value.match(/^(\d{2})\.(\d{2})\.(\d{4}) (\d{2}):(\d{2})$/);
    if (!match) {
        return NaN;
    }
    let [, day, month, year, hour, minute] = match;
    let utcGuess = Date.UTC(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute));
    let timeZoneName = new Intl.DateTimeFormat("en", {
        timeZone: "Europe/Zurich",
        timeZoneName: "shortOffset",
    }).formatToParts(new Date(utcGuess)).find(part => part.type === "timeZoneName").value;
    let offsetHours = Number(timeZoneName.match(/GMT([+-]\d+)/)?.[1] ?? 0);
    return utcGuess - offsetHours * 60 * 60 * 1000;
}

async function loadMeteoSwissStations() {
    let [metadataResponse, stationsResponse] = await Promise.all([
        fetch("https://data.geo.admin.ch/ch.meteoschweiz.ogd-smn/ogd-smn_meta_stations.csv"),
        loadStationData(`${meteoSwissStacSearch}?collections=${meteoSwissCollection}&bbox=8.2,45.9,10.7,47.9&limit=100`),
    ]);
    if (!metadataResponse.ok) {
        throw new Error(`MeteoSchweiz-Stationsmetadaten konnten nicht geladen werden (${metadataResponse.status})`);
    }

    let metadataRows = (await metadataResponse.text()).trim().split(/\r?\n/);
    let headers = parseSemicolonCsvRow(metadataRows[0].replace(/^\uFEFF/, ""));
    let column = name => headers.indexOf(name);
    let stationMetadataById = new Map(metadataRows.slice(1).map(row => {
        let values = parseSemicolonCsvRow(row);
        return [values[column("station_abbr")].toLowerCase(), {
            canton: values[column("station_canton")],
            altitude: Number(values[column("station_height_masl")]),
        }];
    }));
    let stations = stationsResponse.features.filter(feature =>
        ["TG", "SG", "GR"].includes(stationMetadataById.get(feature.id)?.canton)
    );
    let stationResults = await Promise.allSettled(stations.map(async stationFeature => {
        let stationId = stationFeature.id;
        let csvUrl = `https://data.geo.admin.ch/${meteoSwissCollection}/${stationId}/ogd-smn_${stationId}_t_now.csv`;
        let csvResponse = await fetch(csvUrl);
        if (!csvResponse.ok) {
            throw new Error(`${stationId}: ${csvResponse.status}`);
        }

        let rows = (await csvResponse.text()).trim().split(/\r?\n/);
        let fields = parseSemicolonCsvRow(rows[0]);
        let valuesByName = new Map(fields.map((field, index) => [field, index]));
        let getValue = (row, name) => {
            let rawValue = row[valuesByName.get(name)]?.trim();
            if (!rawValue || rawValue === "-999" || rawValue === "-9999") {
                return undefined;
            }
            let value = Number(rawValue);
            return Number.isFinite(value) ? value : undefined;
        };
        let measurement;
        let timestamp;
        for (let index = rows.length - 1; index > 0; index--) {
            let row = parseSemicolonCsvRow(rows[index]);
            let candidateTimestamp = parseMeteoSwissTimestamp(row[1]);
            let age = Date.now() - candidateTimestamp;
            if (!Number.isFinite(candidateTimestamp) || age < 0 || age > maxStationAge) {
                continue;
            }

            if (["tre200s0", "ure200s0", "fkl010z0", "dkl010z0", "htoauts0"]
                .some(name => getValue(row, name) !== undefined)) {
                measurement = row;
                timestamp = new Date(candidateTimestamp).toISOString();
                break;
            }
        }
        if (!measurement) {
            return undefined;
        }

        let windSpeed = getValue(measurement, "fkl010z0");
        return {
            type: "Feature",
            id: `meteoswiss-${stationId}`,
            geometry: {
                type: "Point",
                coordinates: [
                    ...stationFeature.geometry.coordinates,
                    stationMetadataById.get(stationId).altitude,
                ],
            },
            properties: {
                name: stationFeature.properties.title.replace(/\s*\([^)]+\)$/, ""),
                operator: "MeteoSchweiz",
                operatorLink: stationFeature.links.find(link => link.rel === "about")?.href
                    ?? "https://www.meteoswiss.admin.ch/",
                altitude: stationMetadataById.get(stationId).altitude,
                date: timestamp,
                LT: getValue(measurement, "tre200s0"),
                RH: getValue(measurement, "ure200s0"),
                WG: windSpeed === undefined ? undefined : windSpeed * 3.6,
                WR: getValue(measurement, "dkl010z0"),
                HS: getValue(measurement, "htoauts0"),
            },
        };
    }));

    let failures = stationResults.filter(result => result.status === "rejected");
    if (failures.length) {
        console.warn(
            `${failures.length} MeteoSchweiz-Stationsdateien konnten nicht geladen werden.`,
            stationResults.flatMap((result, index) => result.status === "rejected"
                ? [`${stations[index].id}: ${result.reason}`]
                : [])
        );
    }
    return stationResults.flatMap(result =>
        result.status === "fulfilled" && result.value ? [result.value] : []
    );
}

function completeDwdStationNames(features, metadata) {
    let stationsById = new Map((metadata?.stations ?? []).filter(station =>
        /^\d{5}$/.test(station.id) && typeof station.name === "string" && station.name.trim() &&
        Number.isFinite(station.lat) && Number.isFinite(station.lng)
    ).map(station => [station.id, station]));

    for (let feature of features) {
        let stationId = String(feature.properties.dwdStationId ?? "").trim();
        if (!/^\d{1,5}$/.test(stationId)) continue;
        let station = stationsById.get(stationId.padStart(5, "0"));
        if (!station) continue;
        let [longitude, latitude] = feature.geometry.coordinates;
        if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) continue;
        let distance = distanceBetweenStations([longitude, latitude], [station.lng, station.lat]);
        // Stationsnummern können nach einer Verlegung einen anderen Standort bezeichnen.
        if (!Number.isFinite(distance) || distance > 1000) continue;
        let fullName = station.name.trim().replace(/\bKr\.(?=\s|$)\s*/g, "Kreis ").trim();
        if (fullName !== feature.properties.name) {
            feature.properties.sourceName ??= feature.properties.name;
            feature.properties.name = fullName;
        }
    }
}

function updateFavoriteStationNames(featuresById) {
    let nextFavorites = favorites.map(favorite => {
        let name = featuresById.get(favorite.id)?.properties.name;
        return name && name !== favorite.name ? { ...favorite, name } : favorite;
    });
    if (nextFavorites.some((favorite, index) => favorite !== favorites[index])) {
        saveFavorites(nextFavorites);
    }
}

async function loadStations() {
    let [avalancheResult, additionalResult, geoSphereResult, meteoSwissResult, bavarianResult, stationNamesResult] = await Promise.allSettled([
        loadStationData("https://static.avalanche.report/weather_stations/stations.geojson"),
        loadStationData("https://static.avalanche.report/eaws_weather_stations/linea.geojson"),
        loadGeoSphereStations(),
        loadMeteoSwissStations(),
        loadBrightSkyStations(),
        loadStationData("data/dwd-stations.json"),
    ]);
    let featuresById = new Map();

    if (additionalResult.status === "fulfilled") {
        for (let feature of additionalResult.value.features) {
            addNewestStation(featuresById, feature, true);
        }
    } else {
        console.error("Der zusätzliche Wetterstations-Feed konnte nicht geladen werden.", additionalResult.reason);
    }

    if (avalancheResult.status === "fulfilled") {
        for (let feature of avalancheResult.value.features) {
            addNewestStation(featuresById, feature, false);
        }
    } else {
        console.error("Der avalanche.report-Wetterstations-Feed konnte nicht geladen werden.", avalancheResult.reason);
    }

    if (geoSphereResult.status === "fulfilled") {
        for (let feature of geoSphereResult.value) {
            addNewestLiveStation(featuresById, feature);
        }
    } else {
        console.error("Die GeoSphere-Live-Wetterstationen konnten nicht geladen werden.", geoSphereResult.reason);
    }

    if (meteoSwissResult.status === "fulfilled") {
        for (let feature of meteoSwissResult.value) {
            addNewestLiveStation(featuresById, feature);
        }
    } else {
        console.error("Die MeteoSchweiz-Live-Wetterstationen konnten nicht geladen werden.", meteoSwissResult.reason);
    }

    if (bavarianResult.status === "fulfilled") {
        for (let feature of bavarianResult.value) {
            addNewestLiveStation(featuresById, feature);
        }
    } else {
        console.error("Die DWD-Live-Wetterstationen aus dem deutschen Alpenraum konnten nicht geladen werden.", bavarianResult.reason);
    }

    if (!featuresById.size) {
        console.error("Es konnten keine Wetterstationen geladen werden.");
        return;
    }

    let now = Date.now();
    let allFeatures = [...featuresById.values()];
    if (stationNamesResult.status === "fulfilled" && Array.isArray(stationNamesResult.value?.stations)) {
        completeDwdStationNames(allFeatures, stationNamesResult.value);
        updateFavoriteStationNames(featuresById);
    } else {
        console.warn("Vollständige DWD-Stationsnamen konnten nicht geladen werden; die gelieferten Namen bleiben erhalten.");
    }
    let freshFeatures = allFeatures.filter(feature => {
        let timestamp = Date.parse(feature.properties.date);
        return Number.isFinite(timestamp) && now - timestamp >= 0 && now - timestamp <= maxStationAge;
    });
    let excludedCount = allFeatures.length - freshFeatures.length;

    if (excludedCount) {
        console.info(`${excludedCount} Wetterstationen wegen veralteter oder fehlender Zeitstempel ausgeblendet.`);
    }
    if (!freshFeatures.length) {
        console.warn("Keine Wetterstationen mit Daten der letzten 90 Minuten gefunden.");
        return;
    }

    fillRegionalMeasurementGaps(freshFeatures);

    let jsondata = {
        type: "FeatureCollection",
        features: freshFeatures,
    };
    let requestedStationId = new URLSearchParams(window.location.search).get("station");
    let focusedLayer;

    L.geoJSON(jsondata, {
        attribution: "Datenquellen: <a href='https://data.geo.admin.ch/api/stac/v1/collections/ch.meteoschweiz.ogd-smn'>MeteoSchweiz</a>, <a href='https://data.hub.geosphere.at/de/dataset/tawes-v1-10min'>GeoSphere Austria</a>, <a href='https://brightsky.dev/'>DWD via Bright Sky</a>, <a href='https://lawinen.report/eaws_weather_stations/linea.geojson'>Lawinen.report</a>, <a href='https://static.avalanche.report/weather_stations/stations.geojson'>avalanche.report</a>",
        pointToLayer: function (feature, latlng) {
            return L.marker(latlng, {
                icon: L.icon({
                    iconUrl: "icons/wifi.png",
                    iconAnchor: [16, 37],
                    popupAnchor: [0, -37]
                })
            });
        },
        onEachFeature: function (feature, layer) {
            bindStationPopup(layer, feature, true);
            if (feature.id === requestedStationId) {
                focusedLayer = layer;
            }
        }
    }).addTo(overlays.stations);
    if (focusedLayer) {
        map.setView(focusedLayer.getLatLng(), Math.max(map.getZoom(), 11));
        focusedLayer.openPopup();
    } else if (requestedStationId) {
        console.warn(`Die angeforderte Wetterstation wurde nicht gefunden: ${requestedStationId}`);
    }
    showTemperature(jsondata);
    showHumidity(jsondata);
    showWind(jsondata);
    showSnow(jsondata);
    showDirect(jsondata);
}
stationDataReady = loadStations().catch(function (error) {
    console.error("Wetterstationen konnten nicht vollständig geladen werden.", error);
});

function formatValue(value) {
    return typeof value === "number" && Number.isFinite(value) ? value.toFixed(1) : value ?? "-";
}

function formatWindDirection(degrees) {
    let directions = ["Nord", "Nordost", "Ost", "Südost", "Süd", "Südwest", "West", "Nordwest"];
    let normalizedDegrees = ((degrees % 360) + 360) % 360;
    let direction = directions[Math.round(normalizedDegrees / 45) % directions.length];
    return `${direction} (${Math.round(normalizedDegrees)}°)`;
}

function distanceBetweenStations(firstCoordinates, secondCoordinates) {
    let toRadians = degrees => degrees * Math.PI / 180;
    let [firstLongitude, firstLatitude] = firstCoordinates;
    let [secondLongitude, secondLatitude] = secondCoordinates;
    let latitudeDifference = toRadians(secondLatitude - firstLatitude);
    let longitudeDifference = toRadians(secondLongitude - firstLongitude);
    let haversine = Math.sin(latitudeDifference / 2) ** 2 +
        Math.cos(toRadians(firstLatitude)) * Math.cos(toRadians(secondLatitude)) *
        Math.sin(longitudeDifference / 2) ** 2;
    return 6371000 * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
}

function isInBodenseeOberschwaben(feature) {
    let [longitude, latitude] = feature.geometry.coordinates;
    return latitude >= bodenseeOberschwabenBounds.south &&
        latitude <= bodenseeOberschwabenBounds.north &&
        longitude >= bodenseeOberschwabenBounds.west &&
        longitude <= bodenseeOberschwabenBounds.east;
}

function fillRegionalMeasurementGaps(features) {
    let sourceFeatures = features.map(feature => ({
        ...feature,
        properties: { ...feature.properties },
    }));
    let measurements = ["LT", "RH", "WG", "WR", "HS", "RS"];

    for (let feature of features) {
        if (!isInBodenseeOberschwaben(feature)) {
            continue;
        }

        let measurementSources = { ...feature.properties.measurementSources };
        for (let measurement of measurements) {
            if (isValidMeasurement(feature.properties[measurement])) {
                continue;
            }

            let nearestStation;
            let nearestDistance = Infinity;
            for (let candidate of sourceFeatures) {
                if (candidate === feature || !isValidMeasurement(candidate.properties[measurement])) {
                    continue;
                }
                let distance = distanceBetweenStations(
                    feature.geometry.coordinates,
                    candidate.geometry.coordinates,
                );
                if (distance <= regionalFallbackMaxDistance && distance < nearestDistance) {
                    nearestStation = candidate;
                    nearestDistance = distance;
                }
            }

            if (!nearestStation) {
                continue;
            }

            feature.properties[measurement] = nearestStation.properties[measurement];
            measurementSources[measurement] = {
                name: nearestStation.properties.name,
                date: nearestStation.properties.date,
                distanceKm: Math.round(nearestDistance / 100) / 10,
            };
        }
        feature.properties.measurementSources = measurementSources;
    }
}

const stationForecastCache = new Map();
const stationForecastRequests = new Map();

function stationForecastUrl(feature) {
    let [longitude, latitude, elevation] = feature.geometry.coordinates;
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude) ||
        Math.abs(latitude) > 90 || Math.abs(longitude) > 180) {
        throw new Error("Ungültige Stationskoordinaten");
    }
    let url = new URL("https://api.met.no/weatherapi/locationforecast/2.0/compact");
    url.searchParams.set("lat", (Math.trunc(latitude * 10000) / 10000).toFixed(4));
    url.searchParams.set("lon", (Math.trunc(longitude * 10000) / 10000).toFixed(4));
    let altitude = Number.isFinite(elevation) ? elevation : feature.properties.altitude;
    if (Number.isFinite(altitude) && altitude >= -500 && altitude <= 9000) {
        url.searchParams.set("altitude", Math.round(altitude));
    }
    return url.href;
}

async function loadStationForecast(feature) {
    let url = stationForecastUrl(feature);
    let cached = stationForecastCache.get(url);
    if (cached && cached.expires > Date.now()) {
        return cached.data;
    }
    if (stationForecastRequests.has(url)) {
        return stationForecastRequests.get(url);
    }
    let request = (async function () {
        let controller = new AbortController();
        let timer = setTimeout(() => controller.abort(), 15000);
        try {
            let response = await fetch(url, { signal: controller.signal });
            if (!response.ok) {
                throw new Error(`Vorhersage nicht verfügbar (${response.status})`);
            }
            let data = await response.json();
            if (!Array.isArray(data?.properties?.timeseries)) {
                throw new Error("Ungültige Vorhersagedaten");
            }
            let serverExpiry = Date.parse(response.headers.get("Expires"));
            stationForecastCache.delete(url);
            stationForecastCache.set(url, {
                data,
                expires: Math.max(Date.now() + 30 * 60 * 1000, serverExpiry || 0),
            });
            if (stationForecastCache.size > 100) {
                stationForecastCache.delete(stationForecastCache.keys().next().value);
            }
            return data;
        } finally {
            clearTimeout(timer);
        }
    })();
    stationForecastRequests.set(url, request);
    try {
        return await request;
    } finally {
        stationForecastRequests.delete(url);
    }
}

function selectForecastHours(data, now = Date.now()) {
    let end = now + 24 * 60 * 60 * 1000;
    return data.properties.timeseries.filter(entry => {
        let time = Date.parse(entry.time);
        return time >= now && time < end;
    }).sort((first, second) => Date.parse(first.time) - Date.parse(second.time));
}

function forecastWeatherLabel(symbol) {
    let base = symbol.replace(/_(day|night|polartwilight)$/, "");
    let names = { clearsky: "Klar", fair: "Heiter", partlycloudy: "Leicht bewölkt", cloudy: "Bewölkt", fog: "Nebel" };
    if (names[base]) return names[base];
    let description = base.includes("sleet") ? "Schneeregen" :
        base.includes("snow") ? "Schnee" : base.includes("rain") ? "Regen" : "Wettervorhersage";
    if (base.includes("showers")) description += "schauer";
    if (base.includes("thunder")) description += " mit Gewitter";
    return description;
}

function renderStationForecast(container, data, { compact = false } = {}) {
    let hours = selectForecastHours(data);
    if (compact) {
        let nextTime = -Infinity;
        hours = hours.filter(hour => {
            let time = Date.parse(hour.time);
            if (time < nextTime) return false;
            nextTime = time + 3 * 60 * 60 * 1000;
            return true;
        }).slice(0, 8);
    }
    if (!hours.length) throw new Error("Keine Vorhersage für die nächsten 24 Stunden");
    container.replaceChildren();
    let note = document.createElement("p");
    note.className = "forecast-note";
    note.textContent = "Modellvorhersage für den Stationsstandort · keine Stationsmessung. Im Gebirge sind örtliche Abweichungen möglich.";
    let strip = document.createElement("div");
    strip.className = compact ? "forecast-hours forecast-hours-compact" : "forecast-hours";
    if (!compact) strip.tabIndex = 0;
    strip.setAttribute("role", "region");
    strip.setAttribute("aria-label", compact ? "Vorhersage in Drei-Stunden-Schritten" : "Stündliche Vorhersage, seitlich scrollbar");
    let valueText = (value, unit) => Number.isFinite(value) ? `${formatValue(value)} ${unit}` : "–";
    for (let hour of hours) {
        let card = document.createElement("div");
        card.className = "forecast-hour";
        let time = document.createElement("time");
        time.dateTime = hour.time;
        time.textContent = new Date(hour.time).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
        time.title = new Date(hour.time).toLocaleString("de-DE");
        let details = hour.data?.instant?.details ?? {};
        let interval = hour.data?.next_1_hours;
        let symbol = interval?.summary?.symbol_code ?? "";
        let weather = document.createElement("span");
        weather.className = compact ? "forecast-weather visually-hidden" : "forecast-weather";
        weather.textContent = symbol ? forecastWeatherLabel(symbol) : "Keine Wetterangabe";
        card.append(time);
        if (/^[a-z0-9_]+$/.test(symbol)) {
            let icon = document.createElement("img");
            icon.src = `https://samuesl.github.io/forecast/icons/${symbol}.svg`;
            icon.alt = "";
            icon.width = compact ? 28 : 36;
            icon.height = compact ? 28 : 36;
            icon.loading = "lazy";
            icon.addEventListener("error", () => {
                icon.hidden = true;
                if (compact) weather.className = "forecast-weather forecast-symbol-fallback";
            });
            card.append(icon);
        }
        let temperature = document.createElement("strong");
        temperature.textContent = valueText(details.air_temperature, "°C");
        let precipitation = document.createElement("span");
        precipitation.textContent = valueText(interval?.details?.precipitation_amount, "mm/1h");
        precipitation.title = "Niederschlag in der folgenden Stunde";
        let wind = document.createElement("span");
        let windValue = valueText(Number.isFinite(details.wind_speed) ? details.wind_speed * 3.6 : undefined, "km/h");
        wind.textContent = compact ? windValue : `Wind ${windValue}`;
        wind.title = "Windgeschwindigkeit";
        wind.setAttribute("aria-label", `Windgeschwindigkeit ${windValue}`);
        card.append(weather, temperature);
        if (!compact) card.append(precipitation);
        card.append(wind);
        strip.append(card);
    }
    let credit = document.createElement("p");
    credit.className = "forecast-credit";
    let updated = new Date(data.properties.meta?.updated_at);
    if (!compact && Number.isFinite(updated.getTime())) {
        credit.append(`Modellstand: ${updated.toLocaleString("de-DE")} · `);
    }
    let source = document.createElement("a");
    source.href = "https://api.met.no/weatherapi/locationforecast/2.0/documentation";
    source.textContent = "MET Norway";
    source.target = "_blank";
    source.rel = "noopener noreferrer";
    let license = document.createElement("a");
    license.href = "https://creativecommons.org/licenses/by/4.0/";
    license.textContent = "CC BY 4.0";
    license.target = "_blank";
    license.rel = "noopener noreferrer";
    credit.append(source, " · ", license, compact ? " · Modellvorhersage" : " · Wind in km/h umgerechnet. Symbole: MET Norway.");
    if (!compact) container.append(note);
    container.append(strip, credit);
}

let mobileForecastSheet;
let mobileForecastRequestId = 0;

function closeMobileStationForecast() {
    if (!mobileForecastSheet?.dialog.open) return;
    mobileForecastRequestId++;
    mobileForecastSheet.dialog.close();
    mobileForecastSheet.content.removeAttribute("aria-busy");
    let trigger = mobileForecastSheet.trigger;
    if (trigger?.isConnected) trigger.focus({ preventScroll: true });
}

function createMobileForecastSheet() {
    let dialog = document.createElement("dialog");
    dialog.className = "mobile-forecast-sheet";
    dialog.setAttribute("aria-labelledby", "mobile-forecast-title");
    dialog.innerHTML = `
        <div class="mobile-forecast-header">
            <div>
                <p class="mobile-forecast-subtitle">24 Stunden · in 3-Stunden-Schritten</p>
                <h3 id="mobile-forecast-title"></h3>
            </div>
            <button type="button" class="mobile-forecast-close" aria-label="Vorhersage schließen" title="Vorhersage schließen">×</button>
        </div>
        <div class="mobile-forecast-content" aria-live="polite"></div>
    `;
    document.body.append(dialog);
    let closeButton = dialog.querySelector("button");
    closeButton.addEventListener("click", closeMobileStationForecast);
    dialog.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            event.preventDefault();
            closeMobileStationForecast();
        }
    });
    window.matchMedia("(max-width: 600px)").addEventListener("change", function (event) {
        if (!event.matches) closeMobileStationForecast();
    });
    return {
        dialog,
        title: dialog.querySelector("h3"),
        content: dialog.querySelector(".mobile-forecast-content"),
        closeButton,
    };
}

async function showMobileStationForecast(feature, trigger) {
    if (!mobileForecastSheet) mobileForecastSheet = createMobileForecastSheet();
    let sheet = mobileForecastSheet;
    let requestId = ++mobileForecastRequestId;
    sheet.trigger = trigger;
    sheet.title.textContent = feature.properties.name;
    sheet.content.textContent = "Vorhersage wird geladen …";
    sheet.content.setAttribute("aria-busy", "true");
    sheet.content.scrollTop = 0;
    if (!sheet.dialog.open) sheet.dialog.show();
    sheet.closeButton.focus({ preventScroll: true });
    try {
        let data = await loadStationForecast(feature);
        if (requestId !== mobileForecastRequestId || !sheet.dialog.open) return;
        renderStationForecast(sheet.content, data, { compact: true });
    } catch (error) {
        if (requestId !== mobileForecastRequestId || !sheet.dialog.open) return;
        sheet.content.textContent = "Vorhersage momentan nicht verfügbar. ";
        let retry = document.createElement("button");
        retry.type = "button";
        retry.className = "forecast-retry";
        retry.textContent = "Erneut versuchen";
        retry.addEventListener("click", () => showMobileStationForecast(feature, trigger));
        sheet.content.append(retry);
    } finally {
        if (requestId === mobileForecastRequestId) sheet.content.removeAttribute("aria-busy");
    }
}

const stationForecastViews = new WeakMap();
const stationForecastLayout = window.matchMedia("(max-width: 600px)");
stationForecastLayout.addEventListener("change", function () {
    for (let panel of document.querySelectorAll(".station-forecast")) {
        stationForecastViews.get(panel)?.();
    }
});

function bindStationForecast(popup, feature) {
    let panel = popup.getElement().querySelector(".station-forecast");
    if (!panel) return;
    if (stationForecastViews.has(panel)) {
        stationForecastViews.get(panel)();
        return;
    }
    let content = panel.querySelector(".station-forecast-content");
    let loading = false;
    let loaded = false;
    let mobileButton = panel.querySelector(".forecast-mobile-open");
    mobileButton.addEventListener("click", function () {
        showMobileStationForecast(feature, mobileButton);
    });
    async function showForecast() {
        if (loading || loaded) return;
        loading = true;
        content.setAttribute("aria-busy", "true");
        content.textContent = "Vorhersage wird geladen …";
        popup.update();
        try {
            let data = await loadStationForecast(feature);
            renderStationForecast(content, data, { compact: true });
            loaded = true;
        } catch (error) {
            content.textContent = "Vorhersage momentan nicht verfügbar. ";
            let retry = document.createElement("button");
            retry.type = "button";
            retry.className = "forecast-retry";
            retry.textContent = "Erneut versuchen";
            retry.addEventListener("click", showForecast);
            content.append(retry);
        } finally {
            loading = false;
            content.removeAttribute("aria-busy");
            if (popup.isOpen()) popup.update();
        }
    }
    function updateLayout() {
        if (!stationForecastLayout.matches) showForecast();
        if (popup.isOpen()) popup.update();
    }
    stationForecastViews.set(panel, updateLayout);
    L.DomEvent.disableScrollPropagation(content);
    updateLayout();
}

function stationPopupContent(feature) {
    let pointInTime = new Date(feature.properties.date);
    let altitude = feature.geometry.coordinates[2] ?? feature.properties.altitude;
    let escapeText = value => String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    })[character]);
    let validTime = Number.isFinite(pointInTime.getTime());
    let today = new Date();
    let sameDay = validTime && pointInTime.toDateString() === today.toDateString();
    let timeText = validTime
        ? `${sameDay ? "Gemessen um" : `Gemessen am ${pointInTime.toLocaleDateString("de-DE")} ·`} ${pointInTime.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })} Uhr`
        : "Messzeit unbekannt";
    let temperature = feature.properties.LT;
    let isFavorite = favorites.some(favorite => favorite.id === feature.id);
    let measurementSources = Object.values(feature.properties.measurementSources ?? []);
    let uniqueMeasurementSources = measurementSources.filter((source, index) =>
        measurementSources.findIndex(candidate =>
            candidate.name === source.name && candidate.distanceKm === source.distanceKm
        ) === index
    );
    let measurements = [
        ["Luftfeuchtigkeit", "RH", "%"],
        ["Wind", "WG", "km/h"],
        ["Windrichtung", "WR", "°"],
        ["Schneehöhe", "HS", "cm"],
    ];
    let measurementsList = `<dl class="station-measurements">${measurements.map(([label, property, unit]) => {
        let value = feature.properties[property];
        let displayValue = isValidMeasurement(value) ? formatValue(value) : "-";
        if (label === "Windrichtung" && displayValue !== "-") {
            return `<div class="station-measurement"><dt>${label}</dt><dd>${formatWindDirection(value)}</dd></div>`;
        }
        return `<div class="station-measurement"><dt>${label}</dt><dd>${displayValue}${displayValue === "-" ? "" : ` ${unit}`}</dd></div>`;
    }).join("")}${
        isValidMeasurement(feature.properties.RS)
            ? `<div class="station-measurement"><dt>Strahlung (60 Min.)</dt><dd>${formatValue(feature.properties.RS)}</dd></div>`
            : ""
    }</dl>`;

    let content = document.createElement("div");
    content.className = "station-popup";
    content.innerHTML = `
        <div class="station-popup-heading">
            <button type="button" class="station-favorite-toggle${isFavorite ? " is-favorite" : ""}" aria-label="${isFavorite ? "Favorit entfernen" : "Als Favorit speichern"}" aria-pressed="${isFavorite}" title="${isFavorite ? "Favorit entfernen" : "Als Favorit speichern"}">
                <i class="${isFavorite ? "fa-solid" : "fa-regular"} fa-star" aria-hidden="true"></i>
            </button>
            <h4 class="station-popup-title">${escapeText(feature.properties.name)}</h4>
            <p class="station-popup-altitude">${Number.isFinite(Number(altitude)) && altitude != null ? `${escapeText(formatValue(Number(altitude)))} m Höhe` : "Höhe unbekannt"}</p>
            ${uniqueMeasurementSources.length
                ? `<details class="station-source-info">
                    <summary aria-label="Herkunft ergänzter Messwerte" title="Herkunft ergänzter Messwerte">i</summary>
                    <div class="station-source-info-content">
                        <strong>Ergänzte Werte</strong>
                        <ul>${uniqueMeasurementSources.map(source =>
                            `<li>${escapeText(source.name)} (${escapeText(source.distanceKm)} km, ${new Date(source.date).toLocaleTimeString()})</li>`
                        ).join("")}</ul>
                    </div>
                </details>`
                : ""}
        </div>
        <p class="station-popup-time"${validTime ? ` title="${pointInTime.toLocaleString("de-DE")}"` : ""}>${timeText}</p>
        <div class="station-current-temperature">
            <span>Lufttemperatur</span>
            <strong>${isValidMeasurement(temperature) ? `${formatValue(temperature)}<span> °C</span>` : "–"}</strong>
        </div>
        ${measurementsList}
        <div class="station-forecast">
            <h5 class="forecast-heading">Vorhersage · nächste 24 Stunden</h5>
            <button type="button" class="forecast-mobile-open">24-Stunden-Vorhersage</button>
            <div class="station-forecast-content" aria-live="polite"></div>
        </div>
    `;
    return content;
}

function bindStationPopup(layer, feature, isStationLayer = false) {
    layer.bindPopup(stationPopupContent(feature));
    if (isStationLayer) {
        stationLayersById.set(feature.id, layer);
    }
    layer.on("popupopen", function (event) {
        bindStationForecast(event.popup, feature);
        let button = event.popup.getElement().querySelector(".station-favorite-toggle");
        if (!button) {
            return;
        }
        button.dataset.stationId = String(feature.id);
        setFavoriteButtonState(
            button,
            favorites.some(favorite => favorite.id === feature.id),
        );
        button.onclick = () => toggleStationFavorite(feature);
    });
    return layer;
}

function showTemperature(jsondata) {
    L.geoJSON(jsondata, {
        filter: feature => isValidMeasurement(feature.properties.LT),
        pointToLayer: function (feature, latlng) {
            let color = getColor(feature.properties.LT, COLORS.temperature);
            return bindStationPopup(L.marker(latlng, {
                icon: L.divIcon({
                    className: "aws-div-icon",
                    html: `<span style = "background-color:${color}">${feature.properties.LT.toFixed(1)}</span>`
                }),
            }), feature);
        },
    }).addTo(overlays.temperature);
}

function showHumidity(jsondata) {
    L.geoJSON(jsondata, {
        filter: feature => isValidMeasurement(feature.properties.RH) &&
            feature.properties.RH >= 0 && feature.properties.RH <= 100,
        pointToLayer: function (feature, latlng) {
            return bindStationPopup(L.marker(latlng, {
                icon: L.divIcon({
                    className: "aws-div-icon-humidity",
                    html: `<span><i class="fa-solid fa-droplet"></i><b>${formatValue(feature.properties.RH)}%</b></span>`,
                    iconSize: [72, 38],
                    iconAnchor: [36, 19],
                }),
            }), feature);
        },
    }).addTo(overlays.humidity);
}



//Windgeschwindigkeit
function showWind(jsondata) {
    L.geoJSON(jsondata, {
        filter: feature => isValidMeasurement(feature.properties.WG),
        pointToLayer: function (feature, latlng) {
            let color = getColor(feature.properties.WG, COLORS.wind);
            return bindStationPopup(L.marker(latlng, {
                icon: L.divIcon({
                    className: "aws-div-icon-wind-speed",
                    html: `<span style="background-color:${color}"> ${feature.properties.WG.toFixed(1)}</span>`
                })
            }), feature);
        },
    }).addTo(overlays.wind);
}

//Schneehöhe
function showSnow(jsondata) {
    L.geoJSON(jsondata, {
        filter: feature => isValidMeasurement(feature.properties.HS),
        pointToLayer: function (feature, latlng) {
            let color = getColor(feature.properties.HS, COLORS.snow);
            return bindStationPopup(L.marker(latlng, {
                icon: L.divIcon({
                    className: "aws-div-icon-snow",
                    html: `<span style="background-color:${color}"> ${feature.properties.HS.toFixed(1)}</span>`
                })
            }), feature);
        },
    }).addTo(overlays.snow);
}

//windrichtung
function showDirect(jsondata) {

    L.geoJSON(jsondata, {
        filter: feature => isValidMeasurement(feature.properties.WR),
        pointToLayer: function (feature, latlng) {
            let color = getColor(feature.properties.WG, COLORS.wind);
            return bindStationPopup(L.marker(latlng, {
                icon: L.divIcon({
                    className: "aws-div-icon-wind",
                    html: `<span ><i style ="transform:rotate(${feature.properties.WR}deg);
                    color:${color}"class="fa-solid 
                    fa-circle-arrow-down"></i></span>`,
                })
            }), feature);
        },
    }).addTo(overlays.direction);
}

function getColor(value, ramp) {
    for (let rule of ramp) {
        if (value >= rule.min && value < rule.max) {
            return rule.color;
        }
    }
}
