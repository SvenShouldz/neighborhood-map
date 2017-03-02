// map.js

var map, infowindow;
var markers = [];
var centerMap = {lat: 48.135302, lng: 11.581703};

// Handles errors from GoogleMaps
window.errorHandler = function(){
	alert("Error! Something is wrong with GoogleMaps!");
}

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

	// InfoWindow for the "titlebox"
	infowindow = new google.maps.InfoWindow();
}

function initMarkers() {
	markers = []; // Empty Markers array

	// Loops through viewModel.places and sets Markers
	for (var i = 0; i < viewModel.places().length; i++) {
		// Get positions and name from viewModel.places array
		var position = viewModel.places()[i].location;
		var title = viewModel.places()[i].name;
		// markers get set
		var marker = new google.maps.Marker({
			map: map,
			position: position,
			title: title,
			animation: google.maps.Animation.DROP,
			id: i
		});
		// push them to our markers array
		markers.push(marker)

		// Listens for click on marker and calls viewModel.clickPlace
		marker.addListener('click', function(){
			var myMarker = { name: this.title, location: {lat: this.position.lat(), lng: this.position.lng()}}
			viewModel.clickPlace(myMarker)
		});
		// Listens for mousover on marker for showing the titlebox
		marker.addListener('mouseover', function() {
			infowindow.setContent('<div class="infoWindow">' + this.title + '</div>');
			infowindow.open(map, this);
		});
		// hides the titlebox
		marker.addListener('mouseout', function() {
			infowindow.close();
		});
	}
}

// stops all markers from bouncing
function stopBounce() {
	for (var i = 0; i < markers.length; i++) {
		markers[i].setAnimation(null);
	}
}

// sets given marker on bounce
function bounceMarker(name){
	for(var i = 0; i < markers.length; i++){
		if(markers[i].title.toLowerCase().indexOf(name.toLowerCase()) >= 0) {
			markers[i].setAnimation(google.maps.Animation.BOUNCE);
		}else{
			markers[i].setAnimation(null);
		}
	}
}
