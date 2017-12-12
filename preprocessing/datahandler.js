var fs = require('fs');

var fileCT = "./data/ctSd.json";
var fileCTNew = "./data/ctSdRel.json";

var categories = {
  "sd": {
    "area": ["urban_area", "tribal_are", "farm_area"],
    "race": ["black_afri", "coloured", "asian", "white", "other_race"],
    "lang": [
      "afrikaans", "english", "isi_ndebele", "isi_xhosa", "isi_zulu", "sepedi", "sesotho", "setswana", "sign_lang", "si_swati", "tshivenda", "xitsonga", "other_lang", "unspec_lan", "na_lang"
    ],
    "edu": ["primary", "secondary", "ntc", "cert_dip", "tertiary", "no_schooli", "other_edu"],
    "age": ["a0_9", "a10_19", "a20_29", "a30_39", "a40_49", "a50_59", "a60_69", "a70_79", "a80_plus"]
  },
  "hh": {
    "income": [
      "no_income", "r1_4800", "r4801_9600", "r9601_1960",  "r19601_382", "r38201_764", "r76401_153", "r153801_30", "r307601_61", "r614401_12", "r1228801_2", "r2457601_pl", "unspec_inc"
    ],
    "type": [
      "brk_hse_sep_s", "traditiona", "flats", "clusters", "townhouses", "semi_det", "backyard", "inf_bckyrd", "informal", "not_sep", "crvn_tent", "other_dwel", "unspec_dwe"
    ]
  }
}

var ignore = ['sal_code_i', 'pr_name', 'sp_name', 'the_geom']

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
  var noData = 'noData';
  if(val > totVal || totVal === 'noData') {
    return noData;
  }

  var relVal = ((val / totVal ) * 100);
  var result = Math.ceil(relVal * 10) / 10;

  if (isNaN(result)) {
    result = 'noData';
  }

  return result;
  
}

function getCategory(categories, property) {
  var currentKey = '';
  for (key in categories) {
    categories[key].forEach(function(prop) {
      
      ignore.forEach(function(item) {
        if(item === prop) {
          return 'other';
        }
      })

      if (prop === property) {
        currentKey = key;
      }
    }) 
  }
  return currentKey;
}
  
function transform(json) {
  var data = json.features;
  var props = Object.keys(data[0].properties)
  var valueRelative = 0;

  data.forEach(function(feature, i) {
    var propCurrent = '';
    var total = {
      "sd": { "area": 0, "race": 0, "lang": 0, "edu": 0, "age": 0, "other": 0 },
      "hh": { "income": 0, "type": 0, 'other': 0 },
    }

    ignore.forEach(function(item) {
      var i = props.indexOf(item);
      if(i != -1) { props.splice(i, 1); }
    })

    props.forEach(function(prop) {
      var valueAbs = feature.properties[prop];
      var cat = getCategory(categories.sd, prop);
      propCurrent = prop;

      if (valueAbs !== typeof String && valueAbs < 10000) {
        total.sd[cat] += valueAbs;
      }
    })
        
    props.forEach(function(prop) {
      var valueAbs = feature.properties[prop];
      var cat = getCategory(categories.sd, prop);
      propCurrent = prop;
      var valCatTotal = typeof total.sd[cat] ===  'undefined' ||  isNaN(total.sd[cat]) ? 'noData' : total.sd[cat];
      
      valueRelative = getRelVal(valCatTotal, valueAbs);
      data[i].properties[propCurrent] = valueRelative;
    })

  })
  // console.log(json);
  fs.writeFile(fileCTNew, JSON.stringify(json), function(err) { if(err) {console.log(err)} })
}

readFile(fileCT, transform);

