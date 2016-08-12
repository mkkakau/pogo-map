// Firebase
var fb = {
  db : null,
  config : {
    apiKey: "AIzaSyD0LhmulK6Hrn-m-gfhj3XFNUq2OgfEmzg",
    authDomain: "pogo-63931.firebaseapp.com",
    databaseURL: "https://pogo-63931.firebaseio.com",
    storageBucket: "pogo-63931.appspot.com",
  },
  start : function () {
    firebase.initializeApp(this.config);
    this.db = firebase.database();
  },
  onChildAdded : function (ref, cb) {
    var myRef = this.db.ref(ref);
    myRef.on('child_added', function (snap) {
      var data = snap.val();
      cb(data);
    });
  }
};
fb.start();
// Pokeapi
var pokeapi = {
  urlPrefix : 'https://pokeapi.co/api/v2/pokemon/',
  getData : function (id, cb) {
    var url = this.urlPrefix + id;
    var jqxhr = $.getJSON(url, function (data) {
      data.status = 'ok';
      cb(data);
    })
    .fail(function () {
      var noData = {
        weight: null,
        height: null,
        types: null,
        status: 'fail'
      };
      cb(noData);
    });
  },
};
// Google Maps
var map;
var initMap = function () {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 19.725862, lng: -155.06906},
    zoom: 16
  });
};
var googleError = function () {
  document.getElementById('map').innerHTML = '<h1>Sorry, Google Maps is unavailable at the moment</h1><p>Please try again later.</p>';
};
// Reddit /r/PokemonGoSnap
var pogosnap = {
  urlPrefix : 'https://www.reddit.com/r/PokemonGoSnap/search.json?',
  params : {
    restrict_sr : 'true',
    limit : '1',
    sort : 'top'
  },
  getData : function (pokemon, cb) {
    var self = this;
    var url = self.urlPrefix;
    url += 'q=' + pokemon.name;
    url += '&restrict_sr=' + self.params.restrict_sr;
    url += '&limit=' + self.params.limit;
    url += '&sort=' + self.params.sort;

    var jqxhr = $.getJSON(url, function (data) {
      var listing = data.data.children[0].data;
      if (listing !== undefined) {
        var myData = {
          picture: self.fixUrl(listing.url),
          author: listing.author,
          permalink: 'https://www.reddit.com' + listing.permalink,
          status: 'ok'
        };
        cb(myData);
      }
      else {
        var noData = {
          picture: '#',
          author: '',
          permalink: '',
          status: 'noresults'
        };
        cb(noData);
      }
    })
    .fail(function () {
      var noData = {
        picture: '#',
        author: '',
        permalink: '',
        status: 'fail'
      };
      cb(noData);
    });
  },
  fixUrl : function (url) {
    var newUrl = url;
    if (url.search('reddituploads')) {
      newUrl = url.split('&amp;').join('&');
    }
    if (url.search('imgur') && url.search('.jpg') === -1) {
      newUrl += '.jpg';
    }
    return newUrl;
  },
};
