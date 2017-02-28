//controller.js

var ko = require('knockout');
var request = require('superagent');

function wikiCall(searchPlace){
	viewModel.loadInfo(0);
	request
		.get('https://en.wikipedia.org/api/rest_v1/page/summary/' + searchPlace)
		.end(function(err, res){
			if (err || !res.ok) {
				viewModel.wiki.text("Error when loading:", err)
			} else {
				viewModel.wiki.text(textTrans(res.body.extract));
				viewModel.wiki.img('url(\'' + res.body.thumbnail.original + '\')');
				viewModel.wiki.title(res.body.title);
				viewModel.wiki.url('https://en.wikipedia.org/wiki/' + res.body.title)
			}
		});
}

function textTrans(text){
	var chapter = text.indexOf("== ")
	if( chapter >= 0){
		return text.slice(0, chapter);
	}else{
		return text
	}

}

var viewModel = {

		query: ko.observable(''), // Gets input from User
		places: ko.observableArray(data), // Stores data as observable Array
		wiki: { // stores information from wikipedia
			text: ko.observable(),
			img: ko.observable(),
			title: ko.observable(),
			url: ko.observable(),
			desc: ko.observable()
		},
		infoWindow: ko.observable(0), // Visibility of the infoWindow
		displayWindow: ko.observable('none'), // display of the infoWindow
		loadInfo: ko.observable(0), // Visibility of content of infoWindow


		search: function(value) { // Search Input
			if(typeof value === 'object' && value instanceof Object){
				// prevents user from submitting the form
			}else{
				viewModel.places([]); // Empty array for iterating through data
				for (var i = 0; i < data.length; i++) {
					// Iterates through data and pushes results into the empty places array
					if(data[i].name.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
						viewModel.places.push(data[i]);
					}
				}
			}
		},

		markers: function() { // subscribed to changes in places and renders new markers
			initMarkers();
		},

		closeWindow: function() { // closes infoWindow and stops marker to bounce
			viewModel.infoWindow(0);
			viewModel.displayWindow('none');
			stopBounce();
		},

		openWindow: function() { // opens infoWindow
			viewModel.displayWindow('');
			viewModel.infoWindow(1);
		},

		clickPlace: function(place){
			wikiCall(place.name);
			map.setCenter(place.location);
			map.setZoom(18);
			viewModel.openWindow();
			viewModel.loadInfo(1);
			bounceMarker(place.name)
		}
};

viewModel.query.subscribe(viewModel.search);

viewModel.places.subscribe(viewModel.markers);

ko.applyBindings(viewModel);
