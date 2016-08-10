// Pokemon Class
var Pokemon = function (id, name) {
  var self = this;
  self.id = id;
  self.name = name;
  // Updated from Pokeapi:
  self.types = [];
  self.weight = '';
  self.height = '';
  self.pokeapiStatus = 'loading';
  // Updated from /r/PokemonGoSnap:
  self.picture = '';
  self.author = '';
  self.permalink = '#';
  self.pogosnapStatus = 'loading';
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
  self.logLatLng = function () {
    map.panTo({lat: self.lat, lng: self.lng});
    map.setZoom(17);
  };
  self.setStreetViewUrl();
};
// Spawn Location Class
var SpawnLocation = function (id, lat, lng, pokemon) {
  var self = this;
  self.id = id;
  self.type = 'spawn';
  self.lat = lat;
  self.lng = lng;
  self.icon = 'https://pokeapi.co/media/sprites/pokemon/' + pokemon.id + '.png';
  self.name = pokemon.name;
  self.markerCreated = false;
  self.pokemon_id = pokemon.id;
  self.logLatLng = function () {
    map.panTo({lat: self.lat, lng: self.lng});
    map.setZoom(17);
  };
  self.updatePokeInfo = function (pokemon) {
    self.name = pokemon.name;
    self.pokemon_id = pokemon.id;
    self.icon = 'https://pokeapi.co/media/sprites/pokemon/' + pokemon.id + '.png';
  };
};

var model = {
  pokemons : [],
  locations : [],
  markers : [],
  infowindows : []
};

// // Testing Model
// model.pokemons[1] = new Pokemon(1);
// model.pokemons[1].id = '1';
// model.pokemons[1].name = 'bulbasaur';
//
// var spawn = new SpawnLocation(0, 0, model.pokemons[1]);
// console.log(spawn);
