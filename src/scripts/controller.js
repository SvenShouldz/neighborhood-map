var ko = require('knockout');

console.log("KNOCKOUTSCRIPT");

var data = [
						{ name: 'Isartor', lat: '48.135302', lng: '11.581703'},
						{ name: 'Sendlinger Tor', lat: '48.133996', lng: '11.567702'},
						{ name: 'Marienplatz', lat: '48.13723', lng: '11.575514'},
						{ name: 'Stachus', lat: '48.13914', lng: '11.566359'},
						{ name: 'Bayerischer Rundfunk', lat: '48.142979', lng: '11.554475'},
						{ name: 'Google München', lat: '48.142895', lng: '11.540916'},
						{ name: 'Viktualienmarkt', lat: '48.135254', lng: '11.575947'},
						{ name: 'Museumsinsel', lat: '48.129667', lng: '11.582556'},
						{ name: 'Tierpark Hellabrunn', lat: '48.097934', lng: '11.554785'},
						{ name: 'Allianz Arena', lat: '48.21882', lng: '11.624697'},
						{ name: 'Olympia-Park', lat: '48.174748', lng: '11.550295'},
						{ name: 'Flaucher-Insel', lat: '48.104218', lng: '11.552908'}
					];

var viewModel = {
		query: ko.observable(''),
		places: ko.observable(),

		search: function(value) {
			viewModel.places = [];
			console.log(value)

			for (var i = 0; i < data.length; i++) {

				if(data[i].name.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
					viewModel.places.push(data[i]);
				}
					console.log(viewModel.places);
			}
		}
};

viewModel.query.subscribe(viewModel.search);

ko.applyBindings(viewModel);