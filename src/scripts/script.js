var ko = require('knockout');

var ViewModel = function(data) {
    this.name = ko.observable(data.name);
    this.complete = ko.observable(data.complete);
};

var ViewListModel = function() {
    this.items = ko.observableArray();
};

var ViewList = new ViewListModel();
    //insert some fake todo items for now...
    //ViewList.items.push(new ViewModel({ name: "Pending Item", complete: false }));
    //ViewList.items.push(new ViewModel({ name: "Completed Item", complete: true }));

		console.log("Hallo")

    ko.applyBindings(ViewList);
