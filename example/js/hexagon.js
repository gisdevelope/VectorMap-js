let satelliteLayer = new ol.layer.Tile({
    source: new ol.source.XYZ({
        url: "https://cloud.thinkgeo.com/api/v1/maps/raster/light/x1/3857/512/{z}/{x}/{y}.png" +
            "?apiKey=Yy6h5V0QY4ua3VjqdkJl7KTXpxbKgGlFJWjMTGLc_8s~",
        tileSize: 512,
    }),
});

let map = new ol.Map({
    loadTilesWhileAnimating: true,
    loadTilesWhileInteracting: true,
    layers: [satelliteLayer],
    target: 'map',
    view: new ol.View({
        maxZoom: 19,
        maxResolution: 40075016.68557849 / 512,
        zoom: 10,
        center: ol.proj.fromLonLat([-87.64620, 41.82623]),
        progressiveZoom: false,

    })
});

map.addControl(new ol.control.FullScreen());

const getJson = () => {
    let readTextFile = new Promise(function (resolve, reject) {
        let file = "../data/crime.json";
        let rawFile = new XMLHttpRequest();
        rawFile.overrideMimeType("application/json");
        rawFile.open("GET", file, true);
        rawFile.onreadystatechange = function (ERR) {
            if (rawFile.readyState === 4) {
                if (rawFile.status == "200") {
                    resolve(rawFile.responseText);
                } else {
                    reject(new Error(ERR));
                }
            }
        }
        rawFile.send(null);
    });
    return readTextFile;
};

let source = new ol.source.Vector();
const addFeatures = () => {
    let features = [];
    getJson().then((data) => {
        let result = JSON.parse(data);
        for (let k = 0, length = result.length; k < length; k++) {
            let point = ol.proj.fromLonLat(result[k].geometry.coordinates);
            let seed = point;
            let f = new ol.Feature(new ol.geom.Point(
                seed
            ));
            f.set('id', k);
            features.push(f);
        }
        source.clear();
        source.addFeatures(features);
    });
};

addFeatures();

let hexbin, layer;

let min, max, maxi;
const styleFn = function (f, res) {
    // depending on the number of objects in the aggregate.
    let color;
    const xxl=251;
    const xl =150;
    const max =100;
    const middle =50
    const min = 1;
    if (f.get('features').length > xxl) {
        color = '#3d0401';
    } else if (f.get('features').length > xl && f.get('features').length < xxl) {
        color = '#910902';
    } else if (f.get('features').length > max && f.get('features').length < xl) {
        color = '#c40c02';
    }else if (f.get('features').length > middle && f.get('features').length < max) {
        color = '#e50e03';
    } else if (f.get('features').length > min && f.get('features').length < middle) {
        color = '#fd4a40';
    }  else {
        color = '#fd6962';
    }
    return [new ol.style.Style({
        fill: new ol.style.Fill({
            color: color
        })
    })];
}
// Create HexBin and calculate min/max
const reset = function () {
    let size = 1000;
    if (layer) map.removeLayer(layer);
    let features;

    hexbin = new ol.source.HexBin({
        source: source, // source of the bin
        size: size // hexagon size (in map unit)
    });
    layer = new ol.layer.Vector({
        source: hexbin,
        opacity: 0.7,
        style: styleFn,
        renderMode: 'image'
    });
    features = hexbin.getFeatures();
    // Calculate min/ max value
    min = Infinity;
    max = 0;
    for (let i = 0, f; f = features[i]; i++) {
        let n = f.get('features').length;
        if (n < min) min = n;
        if (n > max) max = n;
    }
    let dl = (max - min);
    maxi = max;
    min = Math.max(1, Math.round(dl / 4));
    max = Math.round(max - dl / 3);

    // Add layer
    map.addLayer(layer);
};

reset();