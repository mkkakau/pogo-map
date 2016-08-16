// Pokemon Class
var Pokemon = function (id, name) {
  var self = this;
  self.id = id;
  self.name = name;
  self.icon = '';
  // Updated from Pokeapi:
  self.types = [];
  self.weight = '';
  self.height = '';
  self.pokeapiStatus = null;
  // Updated from /r/PokemonGoSnap:
  self.picture = '';
  self.author = '';
  self.permalink = '#';
  self.pogosnapStatus = null;

  self.setIcon = function () {
    var location = 'img/';
    var type = '.png';
    var threeDigitId = self.id.toString();
    if (self.id < 10) {
      threeDigitId = '00' + threeDigitId;
    }
    else if (self.id < 100) {
      threeDigitId = '0' + threeDigitId;
    }
    self.icon = location + threeDigitId + type;
  };
  self.setIcon();
};
// Location Class
var Location = function (id, type, lat, lng, name) {
  var self = this;
  self.id = id;
  self.type = type; // gym, pokestop
  self.lat = lat;
  self.lng = lng;
  self.name = name;
  self.icon = 'img/' + type + '.png';
  self.markerCreated = false;
  self.streetViewUrl = '';
  self.setStreetViewUrl = function () {
    var url = 'https://maps.googleapis.com/maps/api/streetview?';
    var params = {
      location : self.lat + ',' + self.lng,
      size : '300x200',
      key : 'AIzaSyDnmyJXbQ5xflnzlvc1dJetLgJPbNerL-o'
    };
    url += 'location=' + params.location;
    url += '&size=' + params.size;
    url += '&key=' + params.key;
    self.streetViewUrl = url;
  };
  self.openInfoWindow = function () {
    infoWindow.setContent(MapView.fillTemplate(self));
    infoWindow.open(map, model.markers[self.id]);
    // Bounce twice on click
    model.markers[self.id].setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function () {
      model.markers[self.id].setAnimation(null);
    }, 1420);
  };
  self.setStreetViewUrl();
};
// Spawn Location Class
var SpawnLocation = function (id, lat, lng, poke_id) {
  var self = this;
  self.id = id;
  self.type = 'spawn';
  self.lat = lat;
  self.lng = lng;
  self.name = '';
  self.icon = '';
  self.poke_id = poke_id;
  self.openInfoWindow = function () {
    infoWindow.setContent(MapView.fillTemplate(self));
    infoWindow.open(map, model.markers[self.id]);
    model.markers[self.id].setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function () {
      model.markers[self.id].setAnimation(null);
    }, 1420);
  };
  self.updatePokemon = function (pokemon) {
    self.poke_id = pokemon.id;
    self.name = pokemon.name;
    self.icon = pokemon.icon;
  };
};

var model = {
  pokemons : [],
  locations : [],
  markers : [],
};
