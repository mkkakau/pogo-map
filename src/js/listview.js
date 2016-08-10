var ListViewViewModel = function () {
  var self = this;
  self.gyms = ko.observableArray();
  self.pokestops = ko.observableArray();
  self.spawns = ko.observableArray();
};
var listView = new ListViewViewModel();
ko.applyBindings(listView);

// Hamburger Menu Setup
$(document).ready(function() {
  $('.drawer').drawer();
});
