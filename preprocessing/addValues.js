var fs = require('fs');

var jbHh = "./data/jbHh.json";
var ctHh = "./data/ctHh.json";
var ctComb = "./data/ctComb.json";
var jbComb = "./data/jbComb.json";

var fileCtNew = "./data/ctCombV2.json"
var fileJbNew = "./data/jbCombV2.json"

var params = ["r38201_764", "r4801_9600", "r9601_1960", "traditiona", "townhouses", "sp_name", "r2457601_p", "r76401_153", "r307601_61", "unspec_dwe", "clusters", "r153801_30", "unspec_inc", "r614401_12", "r19601_382", "flats", "r1228801_2", "backyard", "r1_4800", "inf_bckyrd", "not_sep", "informal", "no_income", "na_dwellin", "semi_det", "other_dwel", "brk_hse_se", "pr_name", "crvn_tent"];

function readFile(segment, all, callback) {

  var fileAll = {
    "type": "FeatureCollection",
    "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
    "features": []
  };

  var fileSeg = {
    "type": "FeatureCollection",
    "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
    "features": []
  };

  fs.readFile(segment, function(err, data) {
    var fSeg = JSON.parse(data).features;

    fs.readFile(all, function(err, data) {
      var fAll = JSON.parse(data).features;

      fAll.forEach(function(featureAll, i) {
        var idAll = featureAll.properties.sal_code_i;

        fSeg.forEach(function(featureSeg) {
          var idSeg = featureSeg.properties.sal_code_i;

          if (idAll === idSeg) {
            params.forEach(function(p) {
              featureAll.properties[p] = featureSeg.properties[p]
            });

            fileAll.features.push(featureAll);
          }
        })

        if(i === fAll.length - 1) {
          callback(fileAll);
        }

      })
    })
  });
  callback();
}

function write(json) {
  fs.writeFile(fileJbNew, JSON.stringify(json), function(err) { if(err) {console.log(err)} })
}

readFile(jbHh, jbComb, write);
