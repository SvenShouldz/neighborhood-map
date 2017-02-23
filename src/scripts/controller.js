//controller.js

var ko = require('knockout');
var request = require('superagent');

function wikiCall(searchPlace){
	request
		.get('https://en.wikipedia.org/api/rest_v1/page/mobile-text/' + searchPlace)
		.end(function(err, res){
			if (err || !res.ok) {
				console.log(err);
			} else {
				console.log(res.body);
			}
		});
}

var viewModel = {

		query: ko.observable(''), // Gets input from User
		places: ko.observableArray(data), // Stores data as observable Array

		search: function(value) {
			viewModel.places([]); // Empty array for iterating through data
			for (var i = 0; i < data.length; i++) {
				// Iterates through data and pushes results into the empty places array
				if(data[i].name.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
					viewModel.places.push(data[i]);
				}
			}
		},

		clickPlace: function(place){
			wikiCall(place.name);
			map.setCenter(place.location);
			map.setZoom(18);
		}
};

viewModel.query.subscribe(viewModel.search);

ko.applyBindings(viewModel);
