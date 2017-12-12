var fs = require('fs');

var ctSd = "./data/ctSdRel.json";
var ctHh = "./data/ctHhRel.json";

var fileCtNew = "./data/ctComb.json"

var params = ["r38201_764", "r4801_9600", "r9601_1960", "traditiona", "townhouses", "sp_name", "r2457601_p", "r76401_153", "r307601_61", "unspec_dwe", "clusters", "r153801_30", "unspec_inc", "r614401_12", "r19601_382", "flats", "r1228801_2", "backyard", "r1_4800", "inf_bckyrd", "not_sep", "informal", "no_income", "na_dwellin", "semi_det", "other_dwel", "brk_hse_se", "pr_name", "crvn_tent"];

function readFile(file1, file2, callback) {

  var combined = {
    "type": "FeatureCollection",
    "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
    "features": []
  };

  fs.readFile(file1, function(err, data) {
    var f1 = JSON.parse(data).features;

    fs.readFile(file2, function(err, data) {
      var f2 = JSON.parse(data).features;
      var params = Object.keys(f2[0].properties);

      f2.forEach(function(featuresFile2, i) {
        var idsF2 = featuresFile2.properties.sal_code_i;
        var idsF1 = f1[i].properties.sal_code_i;

          if (idsF2 === idsF1) {
            const merged = Object.assign(f1[i].properties, featuresFile2.properties);
            const geometry = featuresFile2.geometry;

            combined.features.push({
              "type": "Feature",
              "properties": merged,
              "geometry": geometry
            });

          }

        if(i === f2.length - 1) {
          callback(combined);
        }

      })
    })
  });
  callback();
}

function write(json) {
  // console.log(json);
  fs.writeFile(fileCtNew, JSON.stringify(json), function(err) { if(err) {console.log(err)} })
}

readFile(ctSd, ctHh, write);
