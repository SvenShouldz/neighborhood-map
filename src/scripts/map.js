console.log("hallo auch")
var map;

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 48.135125, lng: 11.581981},
    zoom: 18,
		mapTypeId: google.maps.MapTypeId.SATELLITE,
		tilt: 45
  });

}
