var MapView = {
  createMarker : function (location) {
    var self = this;
    if (model.markers[location.id] === undefined) {
      model.markers[location.id] = new google.maps.Marker({
        position: {lat: location.lat, lng: location.lng},
        map: map,
        icon: location.icon,
        title: location.name,
        id: location.id
      });
      model.markers[location.id].addListener('click', function () {
        // Open infowindow
        infoWindow.setContent(self.fillTemplate(location));
        infoWindow.open(map, model.markers[location.id]);
        // Bounce twice on click
        model.markers[location.id].setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function () {
          model.markers[location.id].setAnimation(null);
        }, 1420);
      });
    }
    else {
      console.log('Marker already created for location:', location.name);
    }
  },
  template :

  '<div id="loc-%id%">' +
    '<h3>%name%</h3>' +
    '<p>(%lat%, %lng%)</p>' +
    '<p>Google Street View: </p>' +
    '<img src="%streetview%" alt="%name%">' +
  '</div>',

  spawnTemplate :

  '<div id="loc-%id%">' +
    '<h3>#%pokemon_id% %name%</h3>' +
    '<p>(%lat%, %lng%)</p>' +
    '%pogosnapStatus%' +
    '<div class="pic"%pogosnapHidden%>' +
      '<img src="%picture%" alt="%name%" style="width: 15em; height: 15em; object-fit: cover;">' +
      '<p>' +
        'Image Source: <a href="%permalink%">/r/PokemonGoSnap</a><br>' +
        'Posted by: %author%' +
      '</p>' +
    '</div>' +
    '%pokeapiStatus%' +
    '<div class="bio" %pokeapiHidden%>' +
      '<ul>' +
        '<li>Types: %types%</li>' +
        '<li>Weight: %weight% kg</li>' +
        '<li>Height: %height% m</li>' +
      '</ul>' +
    '</div>'+
  '</div>',

  fillTemplate : function (location) {
    var content;
    var pokemon = model.pokemons[location.poke_id];

    // Pokemon specific template items:
    if (location.type === 'spawn') {
      content = this.spawnTemplate;
      content = content.split('%pokemon_id%').join(location.poke_id);
      content = content.split('%picture%').join(pokemon.picture);

      if (pokemon.pogosnapStatus === 'ok') {
        content = content.split('%pogosnapHidden%').join('');
        content = content.split('%pogosnapStatus%').join('');
        content = content.split('%author%').join(pokemon.author);
        content = content.split('%permalink%').join(pokemon.permalink);
      }

      else if (pokemon.pogosnapStatus === 'noresults') {
        content = content.split('%pogosnapHidden%').join(' hidden');
        content = content.split('%pogosnapStatus%').join('<p>Pokemon does not have a picture</p>');
      }

      else if (pokemon.pogosnapStatus === 'loading') {
       content = content.split('%pogosnapHidden%').join(' hidden');
       content = content.split('%pogosnapStatus%').join('<p>Loading picture...</p><br>' +
       '<img src="https://upload.wikimedia.org/wikipedia/commons/d/de/Ajax-loader.gif" "Loading icon">');
      }

      else {
        content = content.split('%pogosnapHidden%').join(' hidden');
        content = content.split('%pogosnapStatus%').join('<p>Error loading picture from Reddit</p>');
      }

      if(pokemon.pokeapiStatus === 'ok') {
        content = content.split('%pogoapiHidden%').join('');
        content = content.split('%pokeapiStatus%').join('');
        content = content.split('%weight%').join(pokemon.weight / 10);
        content = content.split('%height%').join(pokemon.height / 10);
        var types = pokemon.types.join(', ');
        content = content.split('%types%').join(types);
      }

      else if (pokemon.pokeapiStatus === 'loading') {
        content = content.split('%pokeapiHidden%').join(' hidden');
        content = content.split('%pokeapiStatus%').join('<p>Loading stats...</p><br>' +
        '<img src="https://upload.wikimedia.org/wikipedia/commons/d/de/Ajax-loader.gif" "Loading icon">');
      }

      else {
        content = content.split('%pokeapiHidden%').join(' hidden');
        content = content.split('%pokeapiStatus%').join('<p>Error loading stats from Pokeapi</p>');
      }
    }
    // Generic location marker template items:
    else {
      content = this.template;
      content = content.split('%streetview%').join(location.streetViewUrl);
    }

    // Template items for all locations:
    content = content.split('%id%').join(location.id);
    content = content.split('%type%').join(location.type);
    content = content.split('%lat%').join(location.lat);
    content = content.split('%lng%').join(location.lng);
    content = content.split('%name%').join(location.name);
    content = content.split('%icon%').join(location.icon);

    return content;
  }
};
