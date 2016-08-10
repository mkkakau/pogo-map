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
      MapView.updateMarker(pokestop);
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

      model.locations[loc_id] = new SpawnLocation(loc_id, lat, lng, new Pokemon(id, name));
      listView.locations.push(model.locations[loc_id]);
      if (model.pokemons[id] === undefined) {
        model.pokemons[id] = new Pokemon(id, name);
        model.locations[loc_id].updatePokeInfo(model.pokemons[id]);
        MapView.updateMarker(model.locations[loc_id]);

      }
      // Update data from pogosnap
      if (model.pokemons[id].pogoSnapStatus === 'ok') {
        model.locations[loc_id].updatePokeInfo(model.pokemons[id]);
        MapView.updateMarker(model.locations[loc_id]);
      }
      else {
        pogosnap.getData(model.pokemons[id], function (picData) {
          model.pokemons[id].picture = picData.picture;
          model.pokemons[id].permalink = picData.permalink;
          model.pokemons[id].author = picData.author;
          model.pokemons[id].pogosnapStatus = picData.status;
          model.locations[loc_id].updatePokeInfo(model.pokemons[id]);
          MapView.updateMarker(model.locations[loc_id]);
        });
      }

      // Update data from pokeapi
      if (model.pokemons[id].pokeapiStatus === 'ok') {
        model.locations[loc_id].updatePokeInfo(model.pokemons[id]);
        MapView.updateMarker(model.locations[loc_id]);
      }
      else {
        pokeapi.getData(id, function (bioData) {
          model.pokemons[id].weight = bioData.weight;
          model.pokemons[id].height = bioData.height;
          model.pokemons[id].pokeapiStatus = bioData.status;
          if(bioData.types !== null) {
            bioData.types.forEach(function (i) {
              model.pokemons[id].types.push(i.type.name);
            });
          }
          model.locations[loc_id].updatePokeInfo(model.pokemons[id]);
          MapView.updateMarker(model.locations[loc_id]);
        });
      }
    });
  },
};
controller.init();
