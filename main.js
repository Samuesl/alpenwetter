/* Wetterstationen Euregio Beispiel */

// Innsbruck
let ibk = {
    lat: 47.267222,
    lng: 11.392778,
    zoom: 11,
};
const maxStationAge = 90 * 60 * 1000;
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

// Karte initialisierenn
let map = L.map("map").setView([ibk.lat, ibk.lng], ibk.zoom);

// thematische Layer
let overlays = {
    stations: L.featureGroup().addTo(map),
    temperature: L.featureGroup(),
    wind: L.featureGroup(),
    snow: L.featureGroup(),
    direction: L.featureGroup(),
}

// Layer control
L.control.layers({
    "Relief avalanche.report": L.tileLayer(
        "https://static.avalanche.report/tms/{z}/{x}/{y}.webp", {
        attribution: `© <a href="https://sonny.4lima.de">Sonny</a>, <a href="https://www.eea.europa.eu/en/datahub/datahubitem-view/d08852bc-7b5f-4835-a776-08362e2fbf4b">EU-DEM</a>, <a href="https://lawinen.report/">avalanche.report</a>, all licensed under <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>`,
        maxZoom: 12
    }).addTo(map),
    "OpenStreetMap": L.tileLayer.provider("OpenStreetMap.Mapnik"),
    "OpenTopoMap": L.tileLayer.provider("OpenTopoMap"),
    "Esri WorldImagery": L.tileLayer.provider("Esri.WorldImagery"),
}, {
    "Wetterstationen": overlays.stations,
    "Temperatur": overlays.temperature,
    "Windgeschwindigkeit": overlays.wind,
    "Schneehöhe": overlays.snow,
    "Windrichtung": overlays.direction,
}).addTo(map);

// Maßstab
L.control.scale({
    imperial: false,
}).addTo(map);

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

function addNewestStation(featuresById, feature, isAdditionalFeed) {
    let normalizedFeature = normalizeStation(feature, isAdditionalFeed);
    let existingFeature = featuresById.get(feature.id);
    let newTimestamp = Date.parse(normalizedFeature.properties.date);
    let existingTimestamp = existingFeature ? Date.parse(existingFeature.properties.date) : NaN;

    if (!existingFeature || (Number.isFinite(newTimestamp) &&
        (!Number.isFinite(existingTimestamp) || newTimestamp > existingTimestamp))) {
        featuresById.set(feature.id, normalizedFeature);
    }
}

function addNewestLiveStation(featuresById, feature) {
    let [longitude, latitude] = feature.geometry.coordinates;
    let nearbyEntry = [...featuresById.entries()].find(([, existingFeature]) => {
        let [existingLongitude, existingLatitude] = existingFeature.geometry.coordinates;
        let eastWestDistance = (longitude - existingLongitude) * 111320 * Math.cos(latitude * Math.PI / 180);
        let northSouthDistance = (latitude - existingLatitude) * 111320;
        return Math.hypot(eastWestDistance, northSouthDistance) < 100;
    });

    if (nearbyEntry) {
        let existingTimestamp = Date.parse(nearbyEntry[1].properties.date);
        let newTimestamp = Date.parse(feature.properties.date);
        if (Number.isFinite(existingTimestamp) && existingTimestamp >= newTimestamp) {
            return;
        }
        featuresById.delete(nearbyEntry[0]);
    }

    featuresById.set(feature.id, feature);
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
                date: weather.timestamp,
                LT: weather.temperature,
                RH: weather.relative_humidity,
                WG: Number.isFinite(weather.wind_speed_10) ? weather.wind_speed_10 * 3.6 : undefined,
                WR: weather.wind_direction_10,
                PR: Number.isFinite(weather.precipitation_60) ? weather.precipitation_60 : undefined,
                RS: Number.isFinite(weather.solar_60) ? weather.solar_60 : undefined,
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

async function loadStations() {
    let [avalancheResult, additionalResult, geoSphereResult, meteoSwissResult, bavarianResult] = await Promise.allSettled([
        loadStationData("https://static.avalanche.report/weather_stations/stations.geojson"),
        loadStationData("https://static.avalanche.report/eaws_weather_stations/linea.geojson"),
        loadGeoSphereStations(),
        loadMeteoSwissStations(),
        loadBrightSkyStations(),
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

    let jsondata = {
        type: "FeatureCollection",
        features: freshFeatures,
    };
    let requestedStationId = new URLSearchParams(window.location.search).get("station");
    let focusedLayer;

    L.geoJSON(jsondata, {
        attribution: "Datenquellen: <a href='https://data.geo.admin.ch/api/stac/v1/collections/ch.meteoschweiz.ogd-smn'>MeteoSchweiz</a>, <a href='https://dataset.api.hub.geosphere.at/v1/station/current/tawes-v1-10min'>GeoSphere Austria</a>, <a href='https://brightsky.dev/'>DWD via Bright Sky</a>, <a href='https://lawinen.report/eaws_weather_stations/linea.geojson'>Lawinen.report</a>, <a href='https://static.avalanche.report/weather_stations/stations.geojson'>avalanche.report</a>",
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
            let pointInTime = new Date(feature.properties.date);
            let altitude = feature.geometry.coordinates[2] || feature.properties.altitude;
            let additionalMeasurements = Number.isFinite(feature.properties.PR) || Number.isFinite(feature.properties.RS)
                ? `<li> Niederschlag (60 Min., mm) ${formatValue(feature.properties.PR)}</li>
                   <li> Strahlung (60 Min.) ${formatValue(feature.properties.RS)}</li>`
                : "";
            layer.bindPopup(`
                    <h4>${feature.properties.name} (${formatValue(altitude)} m)</h4>
                    <ul>
                    <li> Lufttemperatur (C) ${formatValue(feature.properties.LT)}</li>
                    <li> relative Luftfeuchte (%) ${formatValue(feature.properties.RH)}</li>
                    <li> Windgeschwindigkeit (km/h) ${formatValue(feature.properties.WG)}</li>
                    <li> Schneehöhe (cm) ${formatValue(feature.properties.HS)}</li>
                    ${additionalMeasurements}
                    </ul>
                    <span>${pointInTime.toLocaleString()}</span>
                 `);
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
    showWind(jsondata);
    showSnow(jsondata);
    showDirect(jsondata);
}
loadStations();

function formatValue(value) {
    return typeof value === "number" && Number.isFinite(value) ? value.toFixed(1) : value ?? "-";
}

function showTemperature(jsondata) {
    L.geoJSON(jsondata, {
        filter: function (feature) {
            if (feature.properties.LT > -20 && feature.properties.LT < 50) {
                return true;
            }
        },
        pointToLayer: function (feature, latlng) {
            let color = getColor(feature.properties.LT, COLORS.temperature);
            return L.marker(latlng, {
                icon: L.divIcon({
                    className: "aws-div-icon",
                    html: `<span style = "background-color:${color}">${feature.properties.LT.toFixed(1)}</span>`
                }),
            })
        },
    }).addTo(overlays.temperature);
}



//Windgeschwindigkeit
function showWind(jsondata) {
    L.geoJSON(jsondata, {
        filter: function (feature) {
            if (feature.properties.WG > 0 && feature.properties.WG < 200) {
                return true;
            }
        },
        pointToLayer: function (feature, latlng) {
            let color = getColor(feature.properties.WG, COLORS.wind);
            return L.marker(latlng, {
                icon: L.divIcon({
                    className: "aws-div-icon-wind",
                    html: `<span style="background-color:${color}"> ${feature.properties.WG.toFixed(1)}</span>`
                })
            })
        },
    }).addTo(overlays.wind);
}

//Schneehöhe
function showSnow(jsondata) {
    L.geoJSON(jsondata, {
        filter: function (feature) {
            console.log(feature.properties)
            if (feature.properties.HS > 0 && feature.properties.HS < 1000) {
                return true;
            }
        },
        pointToLayer: function (feature, latlng) {
            let color = getColor(feature.properties.HS, COLORS.snow);
            return L.marker(latlng, {
                icon: L.divIcon({
                    className: "aws-div-icon-snow",
                    html: `<span style="background-color:${color}"> ${feature.properties.HS.toFixed(1)}</span>`
                })
            })
        },
    }).addTo(overlays.snow);
}

//windrichtung
function showDirect(jsondata) {

    L.geoJSON(jsondata, {
        filter: function (feature) {
            console.log(feature.properties)
            if (feature.properties.WR >= 0 && feature.properties.WR < 400) {
                return true;
            }
        },
        pointToLayer: function (feature, latlng) {
            let color = getColor(feature.properties.WG, COLORS.wind);
            return L.marker(latlng, {
                icon: L.divIcon({
                    className: "aws-div-icon-wind",
                    html: `<span ><i style ="transform:rotate(${feature.properties.WR}deg);
                    color:${color}"class="fa-solid 
                    fa-circle-arrow-down"></i></span>`,
                })
            })
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
