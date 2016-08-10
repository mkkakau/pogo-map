var ListViewViewModel = function () {
  var self = this;
  self.query = ko.observable('');
  self.locations = ko.observableArray();
  self.filteredLocations = ko.computed(function () {
    var filter = self.query().toLowerCase();
    var filteredLocations = [];

    if (filter === '') {
      // Make all markers visible
      model.markers.forEach(function (marker) {
        marker.setVisible(true);
      });
      // Return all locations if filter is blank
      return self.locations();
    }
    else {
      // Hide all markers
      model.markers.forEach(function (marker) {
        marker.setVisible(false);
      });
      // Push location to filteredLocations and
      // Make marker for filtered location visible
      self.locations().forEach(function (loc) {
        var name = loc.name.toLowerCase();
        if (name.search(filter) > -1) {
          model.markers[loc.id].setVisible(true);
          filteredLocations.push(loc);
          console.log(loc);
        }
      });
      return filteredLocations;
    }
  });
};
var listView = new ListViewViewModel();
ko.applyBindings(listView);

// Hamburger Menu Setup
$(document).ready(function() {
  $('.drawer').drawer();
});
