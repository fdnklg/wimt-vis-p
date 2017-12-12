import * as L from 'leaflet';
import $ from 'jquery';

import styles from './style.css';
import leaflet from './leaflet.css';

import ct from '../../../preprocessing/data/ctComb.json'

let config = {
  access_token: "pk.eyJ1IjoiZmFiaWFuZWhtZWwiLCJhIjoiY2phcXRyMWJzNWRleTJxbndnb2c5Z29hYiJ9.g2umKz1TwYsU1hKStpQd6A",
  params: Object.keys(ct.features[1].properties)
}

const myLines = [{}];
const boundaries = new L.geoJson(myLines, {
  onEachFeature: onEachFeature
});

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
		  fillOpacity: 0.8    
	  })
  })
}

function getColor(d) {

  if (typeof d === 'string') {
    return '#212121'
  }

  return d > 40  ? '#93EA87' :
		 d > 35  ? '#6DDA90' :
		 d > 30  ? '#4CC898' :
		 d > 25  ? '#31B69C' :
		 d > 20  ? '#22A39D' :
		 d > 15  ? '#279098' :
		 d > 10  ? '#337D8F' :
		 d > 5  ? '#3D6A82' :
		 d > 0  ? '#435771' :
				   '#45455E';
}

const legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

  var div = L.DomUtil.create('div', 'info legend'),
    grades = ['noData', 5, 10, 15, 20, 25, 30, 35, 40],
    labels = [];

  for (var i = 0; i < grades.length; i++) {
    div.innerHTML +=
      '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
      grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
  }

  return div;
};

function highlightFeature(e) {
  var layer = e.target;

  console.log(layer)

  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      layer.bringToFront();
  }
}

function resetHighlight(e) {

}

function onEachFeature(feature, layer) {
  layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
  });
}

legend.addTo(mymap);
setParameter(config.params[0]);

