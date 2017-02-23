// map.js

var map;
var markers = [];
var centerMap = {lat: 48.135125, lng: 11.581981};

// Initial function for Google Maps which will start on
window.initMap = function() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: centerMap,
    zoom: 18,
		mapTypeId: google.maps.MapTypeId.SATELLITE,
		tilt: 45
  });

	var largeInfowindow = new google.maps.InfoWindow();
	// Iterate through data array to create an array of markers on initialize
	for (var i = 0; i < viewModel.places().length; i++) {
		// Get positions and name from data array
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

		marker.addListener('click', function(){
			var myMarker = { name: this.title, location: {lat: this.position.lat(), lng: this.position.lng()}}
			viewModel.clickPlace(myMarker)
		})

	}


}
