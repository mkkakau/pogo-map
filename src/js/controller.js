var controller = {
  init : function () {
    var self = this;
    self.updateGyms();
    self.updateSpawns();
    self.updatePokeStops();
  },
  updateGyms : function () {
    var self = this;
    fb.onChildAdded('gyms', function (data) {
      var location_id = data.id;
      var name = data.title;
      var lat = data.lat;
      var lng = data.lng;
      var gym = new Location (location_id, 'gym', lat, lng, name);
      MapView.createMarker(gym);
      listView.locations.push(gym);
    });
  },
  updatePokeStops : function () {
    var self = this;
    fb.onChildAdded('pokestops', function (data) {
      var location_id = data.id;
      var name = data.title;
      var lat = data.lat;
      var lng = data.lng;
      var pokestop = new Location (location_id, 'pokestop', lat, lng, name);
      MapView.createMarker(pokestop);
      listView.locations.push(pokestop);
    });
  },
  updateSpawns : function () {
    var self = this;
    fb.onChildAdded('spawns', function (data) {
      var loc_id = data.id;
      var id = data.pokemon_id;
      var name = data.pokemon_name;
      var lat = data.lat;
      var lng = data.lng;

      model.locations[loc_id] = new SpawnLocation(loc_id, lat, lng, id);

      // If new pokemon:
      if (model.pokemons[id] === undefined) {
        // Create pokemon with bare info
        model.pokemons[id] = new Pokemon(id, name);
        // Update location name and icon
        model.locations[loc_id].updatePokemon(model.pokemons[id]);
        // Create the location marker
        MapView.createMarker(model.locations[loc_id]);
        // Push location to list view
        listView.locations.push(model.locations[loc_id]);
      }
      // If old pokemon:
      else {
        // Update location name and icon
        model.locations[loc_id].updatePokemon(model.pokemons[id]);
        // Create the location marker
        MapView.createMarker(model.locations[loc_id]);
        // Push location to list view
        listView.locations.push(model.locations[loc_id]);
      }

      // Update data from pogosnap
      if (model.pokemons[id].pogoSnapStatus !== 'loading' && 'ok') {
        model.pokemons[id].pogoSnapStatus = 'loading';
        pogosnap.getData(model.pokemons[id], function (picData) {
          model.pokemons[id].picture = picData.picture;
          model.pokemons[id].permalink = picData.permalink;
          model.pokemons[id].author = picData.author;
          model.pokemons[id].pogosnapStatus = picData.status;
        });
      }

      // Update data from pokeapi
      if (model.pokemons[id].pokeapiStatus !== 'loading' && 'ok') {
        model.pokemons[id].pokeapiStatus = 'loading';
        pokeapi.getData(id, function (bioData) {
          model.pokemons[id].weight = bioData.weight;
          model.pokemons[id].height = bioData.height;
          model.pokemons[id].types = bioData.types;
          model.pokemons[id].pokeapiStatus = bioData.status;
        });
      }
    });
  },
};
controller.init();
