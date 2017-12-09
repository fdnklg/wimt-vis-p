import * as L from 'leaflet';
import $ from 'jquery';

import styles from './style.css';
import leaflet from './leaflet.css';

import ct from '../../../preprocessing/data/ctCombV3.json'
import jb from '../../../preprocessing/data/jbCombV3.json'

let config = {
  access_token: "pk.eyJ1IjoiZmFiaWFuZWhtZWwiLCJhIjoiY2phcXRyMWJzNWRleTJxbndnb2c5Z29hYiJ9.g2umKz1TwYsU1hKStpQd6A",
  params: Object.keys(ct.features[1].properties)
}

const myLines = [{}];
const boundaries = new L.geoJson();

const mymap = L.map('map', {
  center: [-33.931174, 18.506347],
  zoom: 12
});

L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
  id: 'dark-v9',
      accessToken: config.access_token
}).addTo(mymap);

$(ct.features).each(function(key, data) {
  boundaries.addData(data);
});

$(jb.features).each(function(key, data) {
  boundaries.addData(data);
});

boundaries.addTo(mymap);

var $select = $('<select></select>')
.appendTo("#variables")
.on('change', function() {
    setParameter($(this).val())
})

config.params.forEach(function(param) {
  $('<option></option>')
      .text(param)
      .attr('value', param)
      .appendTo($select);
})

function setParameter(param) {
  boundaries.eachLayer( function(layer) {
      layer.setStyle({
          fillColor: getColor(layer.feature.properties[param]),
          weight: 0,
          opacity: .5,
          color: 'white',
          fillOpacity: 0.95    
      })
  })
}

function getColor(d) {
  return d > 90  ? '#93EA87' :
         d > 80  ? '#6DDA90' :
         d > 70  ? '#4CC898' :
         d > 60  ? '#31B69C' :
         d > 50  ? '#22A39D' :
         d > 40  ? '#279098' :
         d > 30  ? '#337D8F' :
         d > 20  ? '#3D6A82' :
         d > 10  ? '#435771' :
                   '#45455E';
}

const legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
            grades = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90],
            labels = [];

        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }

        return div;
    };

legend.addTo(mymap);
setParameter(config.params[0]);

