const geosjonStyle =
{
    "id": "thinkgeo-world-streets-light",
    "version": 1.3,
    "owner": "ThinkGeo LLC",
    "time": "2018/06/09",
    "background": "#aac6ee",
    "variables": {
    },
    "styles": [{
        "id": "country",
        "style": [{
            "filter": "zoom>=0;zoom<=3;",
            "polygon-fill": "#f0eee8"
        },
        {
            "filter": "zoom>=4;zoom<=22;",
            "polygon-fill": "#cccccc"
        }]
    }, {
            "id": "country_boundary",
            "style": [{
                "filter": "zoom>=0;zoom<=19",
                "line-width": 2,
                "line-color": "cccccc",
              
            }
                
            ]
        },],
    "sources": [{
        "id": "countries_source",
        "url": "../data/2012-02-10.kml",
        "type": "KML"
    }],
    "layers": [{
        "id": "worldstreets_layers",
        "source": "countries_source",
        "styles": [
            "country","country_boundary"
        ]
    }]
}



let geoVectorLayer = new ol.mapsuite.VectorLayer(geosjonStyle, {
    multithread: false
})

let view = new ol.View({
    center: ol.proj.fromLonLat([-123.095051, 44.050505]),
    zoom: 3,
    maxZoom: 19,
    maxResolution: 40075016.68557849 / 512
});

let map = new ol.Map({
    target: 'map',
    layers: [
        geoVectorLayer
    ],
    view: view,
    loadTilesWhileInteracting: true,
    loadTilesWhileAnimating: true
});