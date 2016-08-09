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
      MapView.updateMarker(gym);
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
      MapView.updateMarker(pokestop);
    });
  },
  updateSpawns : function () {
    var self = this;
    fb.onChildAdded('spawns', function (data) {
      var location_id = data.id;
      var pokemon_id = data.pokemon_id;
      var pokemon_name = data.pokemon_name;
      var lat = data.lat;
      var lng = data.lng;
      var newPokemon = new Pokemon(pokemon_id, pokemon_name);
      var newSpawn = new SpawnLocation(location_id, lat, lng, newPokemon);
      if (model.pokemons[pokemon_id] === undefined) {
        model.pokemons[pokemon_id] = newPokemon;
        MapView.updateMarker(newSpawn);
        // Update data from pogosnap
        pogosnap.getData(newPokemon, function (picData) {
          model.pokemons[pokemon_id].picture = picData.picture;
          model.pokemons[pokemon_id].permalink = picData.permalink;
          model.pokemons[pokemon_id].author = picData.author;
          model.pokemons[pokemon_id].pogosnapStatus = picData.status;

          MapView.updateMarker(newSpawn);
        });
        // Update data from pokeapi
        pokeapi.getData(pokemon_id, function (bioData) {
          model.pokemons[pokemon_id].weight = bioData.weight;
          model.pokemons[pokemon_id].height = bioData.height;
          model.pokemons[pokemon_id].pokeapiStatus = bioData.status;
          bioData.types.forEach(function (i) {
            model.pokemons[pokemon_id].types.push(i.type.name);
          });
          MapView.updateMarker(newSpawn);
        });
      }
      else {

      }
    });
  },
};
controller.init();
