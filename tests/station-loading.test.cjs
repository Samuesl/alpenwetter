const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const code = fs.readFileSync(path.join(__dirname, "../main.js"), "utf8");
function section(start, end) {
    return code.slice(code.indexOf(start), code.indexOf(end));
}
function feature(id, lon, lat = 47.5, properties = {}) {
    return { type: "Feature", id, geometry: { type: "Point", coordinates: [lon, lat] },
        properties: { name: id, ...properties } };
}
function setup() {
    const added = [], layers = new Set();
    let west = 9, east = 10;
    const map = {
        on() {}, getCenter: () => ({ lat: 47.5, lng: (west + east) / 2 }),
        getBounds: () => ({ toBBoxString: () => `${west},${east}`,
            contains: point => (Array.isArray(point) ? point[1] : point.lng) >= west &&
                (Array.isArray(point) ? point[1] : point.lng) <= east }),
    };
    const context = {
        map, performance, setTimeout, console, URL,
        stationLayersById: new Map(), stationMarkerSignatures: new WeakMap(),
        currentStationData: { type: "FeatureCollection", features: [] },
        overlays: { stations: {
            addLayers(items) { for (const layer of items) { layers.add(layer); added.push(layer.feature.id); } },
            removeLayer(layer) { layers.delete(layer); },
        } },
        L: { icon: value => value, marker: position => ({
            position, isPopupOpen: () => false,
            getLatLng() { return { lat: this.position[0], lng: this.position[1] }; },
            setLatLng(value) { this.position = value; },
            setOpacity(value) { this.opacity = value; },
            setPopupContent(value) { this.popup = value; },
        }) },
        bindStationPopup(layer, item) { layer.feature = item; return layer; },
        lazyStationPopupContent: item => () => item,
    };
    vm.createContext(context);
    vm.runInContext(section("function normalizeStation(", "async function loadGeoSphereStations("), context);
    vm.runInContext("let weatherStationIcon;\n" + section("let stationRenderRevision =", "async function loadStations("), context);
    return { context, added, layers, move: (a, b) => { west = a; east = b; } };
}

test("the spatial index preserves priority, distance merging and station aliases", () => {
    const { context } = setup();
    const map = new Map();
    context.addStationFeature(map, feature("first", 9.5, 47.5, { date: "2026-11-16T10:00:00Z", LT: 8 }));
    context.addStationFeature(map, feature("second", 9.5001, 47.5, { date: "2026-11-16T10:00:00Z", RH: 80 }));
    context.addStationFeature(map, feature("far", 9.6, 47.5));
    assert.equal(map.size, 2);
    assert.equal(map.get("first").properties.LT, 8);
    assert.equal(map.get("first").properties.RH, 80);
    assert.deepEqual(Array.from(map.get("first").stationIds), ["first", "second"]);
    context.addStationFeature(map, feature("first", 9.5, 47.5, { date: "2026-11-16T10:10:00Z", LT: 9 }));
    assert.equal(map.get("first").properties.LT, 9);
    assert.equal(map.size, 2);
});

test("visible pins come first and panning changes the next batch", async () => {
    const { context, added, move } = setup();
    const features = Array.from({ length: 120 }, (_, i) => feature(String(i), 9.5 + i * 0.02));
    const rendering = context.updateStationMarkers({ features: [...features].reverse() });
    assert.equal(added[0], "0");
    const firstBatchSize = added.length;
    assert(firstBatchSize > 0 && firstBatchSize <= 40);
    move(11.6, 11.8);
    await rendering;
    assert.equal(added[firstBatchSize], "110");
    assert.equal(context.stationLayersById.size, 120);
});

test("a newer render cancels old batches and removes obsolete pins", async () => {
    const { context, layers } = setup();
    const first = context.updateStationMarkers({ features: Array.from({ length: 160 }, (_, i) => feature(String(i), 9.5)) });
    const second = context.updateStationMarkers({ features: [feature("latest", 9.5)] });
    await Promise.all([first, second]);
    assert.equal(layers.size, 1);
    assert.equal([...layers][0].feature.id, "latest");
    assert.equal(context.stationLayersById.size, 1);
});

test("a placeholder becomes the same live marker without keeping pending state", async () => {
    const { context } = setup();
    const pending = feature("station", 9.5, 47.5, { pending: true });
    vm.runInContext("stationLocationFeatures = []", context);
    await context.updateStationMarkers({ features: [pending] });
    const marker = context.stationLayersById.get("station");
    assert.equal(marker.opacity, 0.5);
    await context.updateStationMarkers({ features: [feature("station", 9.5, 47.5, { pending: false, LT: 7 })] });
    assert.equal(context.stationLayersById.get("station"), marker);
    assert.equal(marker.opacity, 1);
    assert.equal(marker.feature.properties.LT, 7);
    assert.equal(typeof marker.popup, "function");
});

test("individual provider results arrive before a slow request, with at most four requests", async () => {
    const { context } = setup();
    let release;
    const slow = new Promise(resolve => { release = resolve; });
    let active = 0, maximum = 0;
    const started = [], delivered = [];
    const items = Array.from({ length: 9 }, (_, i) => ({ id: i, lon: i === 8 ? 9.5 : 11 + i, lat: 47.5 }));
    let finished = false;
    const task = context.loadStationTasks(items, async item => {
        started.push(item.id);
        active++;
        maximum = Math.max(maximum, active);
        try {
            if (item.id === 0) await slow;
            if (item.id === 1) throw Error("provider failed");
            return feature(String(item.id), item.lon);
        } finally { active--; }
    }, item => delivered.push(item.id)).then(result => { finished = true; return result; });
    await new Promise(resolve => setTimeout(resolve, 0));
    assert.equal(started[0], 8);
    assert(delivered.includes("8"));
    assert.equal(finished, false);
    assert(maximum <= 4);
    release();
    const result = await task;
    assert.equal(result[1].status, "rejected");
    assert.equal(result[0].value.id, "0");
    assert.equal(delivered.length, 8);
});

test("Leaflet popup updates retain forecast content and event handlers", () => {
    let builds = 0;
    const context = { stationPopupContent: item => { builds++; return { name: item.id, forecast: [] }; } };
    vm.createContext(context);
    vm.runInContext(section("function lazyStationPopupContent(", "function bindStationPopup("), context);
    const getContent = context.lazyStationPopupContent(feature("station", 9.5));
    assert.equal(builds, 0);
    const opened = getContent();
    opened.forecast.push("17:00: 8 Grad");
    opened.mobileClick = () => "forecast dialog";
    assert.equal(getContent(), opened);
    assert.equal(getContent().forecast.length, 1);
    assert.equal(getContent().mobileClick(), "forecast dialog");
    assert.equal(builds, 1);
    const updatedContent = context.lazyStationPopupContent(feature("station", 9.5, 47.5, { LT: 9 }));
    assert.notEqual(updatedContent(), opened);
});
