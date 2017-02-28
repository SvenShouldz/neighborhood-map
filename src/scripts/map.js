// map.js

var map;
var markers = [];
var centerMap = {lat: 48.135302, lng: 11.581703};

// Initial function for Google Maps
window.initMap = function() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: centerMap,
    zoom: 18,
		mapTypeId: google.maps.MapTypeId.SATELLITE,
		tilt: 45
  });

	// Creates all markers
	initMarkers();
}

// This function will hide all Markers
function setMapOnAll(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

function initMarkers() {
	setMapOnAll(null); // Remove all markers from the Map
	markers = []; // Empty Markers array

	// Loops through viewModel.places and sets Markers
	for (var i = 0; i < viewModel.places().length; i++) {
		// Get positions and name from viewModel.places array
		var position = viewModel.places()[i].location;
		var title = viewModel.places()[i].name;

		var marker = new google.maps.Marker({
			map: map,
			position: position,
			title: title,
			animation: google.maps.Animation.DROP,
			id: i
		});

		markers.push(marker)

		var infowindow = new google.maps.InfoWindow();

		marker.addListener('click', function(){
			var myMarker = { name: this.title, location: {lat: this.position.lat(), lng: this.position.lng()}}
			viewModel.clickPlace(myMarker)
		});

		marker.addListener('mouseover', function() {
			infowindow.setContent('<div class="infoWindow">' + this.title + '</div>');
			infowindow.open(map, this);
		});
		marker.addListener('mouseout', function() {
			infowindow.close();
		});
	}
}

function stopBounce() {
	for (var i = 0; i < markers.length; i++) {
		markers[i].setAnimation(null);
	}
}

function bounceMarker(name){
	for(var i = 0; i < markers.length; i++){
		if(markers[i].title.toLowerCase().indexOf(name.toLowerCase()) >= 0) {
			markers[i].setAnimation(google.maps.Animation.BOUNCE);
		}else{
			markers[i].setAnimation(null);
		}
	}
}
