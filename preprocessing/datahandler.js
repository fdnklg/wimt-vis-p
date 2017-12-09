var fs = require('fs');

var fileCT = "./data/ct.geojson";
var fileCTNew = "./data/ctTrans.geojson"

var fileJB = "./data/jbCombV2.json";
var fileJBNew = "./data/jbCombV3.json";

function readFile(file, callback) {

  var json = {
    "type": "FeatureCollection",
    "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
    "features": []
  };
  
  fs.readFile(file, function(err, data) {
    var features = JSON.parse(data).features;
    features.forEach(function(feature, i) {
      json.features.push(feature);
      if(i === features.length - 1) {
        callback(json);
      }
    })
  })
}

function getRelVal(totVal, val) {
  var relVal = ((val / totVal ) * 100);
  var result = Math.ceil(relVal * 10) / 10;
  // console.log(result);
  return result;
}

function transform(json) {
  var data = json.features;

  

  var props = ["asian", "other_race", "coloured", "black_afri", "white", "a0_9", "a10_19", "a20_29", "a30_39", "a40_49", "a50_59", "a60_69", "a70_79", "a80_plus", "other_edu", "primary", "secondary", "teriary"];

  data.forEach(function(feature, i) {
    var total = feature.properties.urban_area;

    props.forEach(function(prop) {
      var relVal = feature.properties[prop];
      data[i].properties[prop] = getRelVal(total, relVal);;
    })
  })
  
  // fs.writeFile(fileJBNew, JSON.stringify(json), function(err) { if(err) {console.log(err)} })
}

readFile(fileJB, transform);

