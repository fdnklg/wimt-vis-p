var fs = require('fs');

var json = "./data/ctComb.json"
var filePath = "./data/split/"

function readFile(json, callback) {

  var combined = {
    "type": "FeatureCollection",
    "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
    "features": []
  };

  fs.readFile(json, function(err, data) {

    var features = JSON.parse(data).features;
    var keys = Object.keys(features[0].properties);

    keys.forEach(function(prop, i) {

      var json = [];

      features.forEach(function(feature) {
        const obj = {};
        obj[prop] = feature.properties[prop];
        obj["sal_code_i"] = feature.properties["sal_code_i"];

        json.push(obj);
      });

      callback(json, prop);
    });
  })
}

function write(json, fileName) {
  var filePath = './splitted/' + fileName + '.json';
  fs.writeFile(filePath, JSON.stringify(json), function(err) { if(err) {console.log(err)} })
}

readFile(json, write);
