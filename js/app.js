/**************************************
 * P5 NEIGHBORHOOD MAP OF UNION CITY
 **************************************/

/**************************************
 * Pre-defined locations in Union City
 **************************************/
var initialUnionCityPlaces =
[
  { types: ["lodging"],                             name: "Holiday Inn Express", location: "37.598473,-122.0672249"},
  { types: ["restaurant", "food", "establishment"], name: "Rose Garden Restaurant", location: "37.592587,-122.038542"},
  { types: ["restaurant", "food", "establishment"], name: "Mexico Lindo Restaurant", location: "37.592681,-122.038815"},
  { types: ["restaurant", "food", "establishment"], name: "Daa'wat", location: "37.592635,-122.03866099999999"},
  { types: ["meal_takeaway", "restaurant", "food"], name: "Mr. Pickle's Sandwich Shop", location: "37.592502,-122.03847200000001"},
  { types: ["restaurant", "food", "establishment"], name: "Kowloon Cafe",  location: "37.596971,-122.048136"}
];

/*** Foursquare url credentials ***/
var today = new Date();
var FOURSQUARE_BASE_URL = 'https://api.foursquare.com/v2/venues/search';
var FOURSQUARE_CLIENT_ID = 'R42ZEH51THS5SGBYAXFED5Y4FDPQDM3CE5H3RKIRICXX5QD3';
var FOURSQUARE_CLIENT_SECRET = 'JQ45ALHZFKTXREINGXUBQNA3YIJGWHOUFGA3TE4P0G2OV22V';
var FOURSQUARE_MODE = 'foursquare';
var FOURSQUARE_DEFAULT_ICON = 'https://foursquare.com/img/categories/food/default_32.png';
var FOURSQUARE_VERSION = today.getFullYear().toString() + ("0" + (today.getMonth() + 1)).slice(-2) + ("0" + (today.getDate())).slice(-2);


/*** Define global variables  needed for the map and searchBox ***/
var map, sv, panorama, service, searchBox;
var unioncityCenter = new google.maps.LatLng(37.593392,-122.043830);


/**************************************
 * When index.html page gets loaded, the
 * google map event listener will call
 * this function to draw a map of Union City
 **************************************/
var initializeMap = function() {

  if (window.google) {
    var mapDiv = document.getElementById('map-canvas');
    var mapOptions = {
      center: unioncityCenter,
      zoom: 15
    };

    /*** Create a google map of Union City ***/
    map  = new google.maps.Map(mapDiv, mapOptions);

    /*** Limit the bounds of Union City ***/
    var defaultBounds = new google.maps.LatLngBounds(new google.maps.LatLng(37.592502,-122.038472), new google.maps.LatLng(37.596971,-122.048136));
    var autoCompleteOptions = {bounds: defaultBounds};

    /*** Obtain places from google api service for Union City ***/
    service = new google.maps.places.PlacesService(map);

    /*** Position a container to display a list of pre-defined locations for Union City ***/
    map.controls[google.maps.ControlPosition.LEFT_TOP].push(document.getElementById('placesId'));

    /*** Position search box to top left ***/
    var input = document.getElementById('pac-input');
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(document.getElementById(input));

    /*** Creates the search box ***/
    searchBox = new google.maps.places.SearchBox(input, autoCompleteOptions);

    /* Google StreetView API panoramic images will be placed here */
    map.controls[google.maps.ControlPosition.RIGHT_TOP].push(document.getElementById("pano"));

    /* Initialize the street view service */
    sv = new google.maps.StreetViewService();

    /* Default the panoramic image to Union City neighborhood */
    var panoramaOptions = {
      position: unioncityCenter,
      pov: {
        heading: 90,
        pitch: 0
      }
    };

    /* Adds the panorama object to the page */
    panorama = new google.maps.StreetViewPanorama(document.getElementById("pano"), panoramaOptions);
    map.setStreetView(panorama);
} else {
    $('#map-canvas')
      .html('<h1> Google Maps is not loaded. Please check your internet connection.</h1>');
  }
};


/*********************************************
 * Create a Model to define all observable and
 * computed bind variables for knockout and
 * the info window html elements to display
 * when a map marker or one of the places
 * in the list is clicked
 *********************************************/
var UnionCityPlaceModel = function(place) {
  this.markerOpen = ko.observable(false);
  this.current_animatedMarker = "";
  this.receivedFourSquareUpdate = ko.observable(false);
  this.types = ko.observableArray(place.types);
  this.name = ko.observable(place.name);
  this.vicinity = ko.observable();
  this.latitude = "";
  this.longitude = "";
  this.icon = '<img src="' + FOURSQUARE_DEFAULT_ICON + '" />';

  this.nameDiv = ko.computed(function () {
    console.log("name=", this.name());
    return '<div class="infoWindowSection"><h5>' + this.icon + '  ' + this.name() + '</h5></div>';
  }, this);

  this.vicinityDiv = ko.computed(function () {
    return '<div class="infoWindowSection"><p>Address: <span class="address">' + this.vicinity() + '</span></p></div>';
  }, this);

  this.infoWindowDiv = ko.computed(function() {
    return '<div class="infoWindowContainer" style="width: 300px;"><div class="MarkerContent">' + this.nameDiv() + this.vicinityDiv() + '</div></div>';
  }, this);
};

/**************************************
 * Add all these functions needed to the
 * Model to search and process a
 * pre-defined place in Union City
 **************************************/
UnionCityPlaceModel.prototype = {
  /*** This init function is called during iteration of each of the pre-defined places ***/
  init: function () {
    var place = {
      types: this.types(),
      name: this.name()
    };
    /*** Format request parameters for nearby search ***/
    var request = {
      location: unioncityCenter,
      radius: 2000,
      name: place.name,
      type: place.types
    };
    /*** Call the google nearbysearch place api for a place ***/
    service.nearbySearch(request, this.addPlaceResultsCallBack.bind(this));
    /*** Create an infoWindow object for a place ***/
    this.infoWindow = new google.maps.InfoWindow({
      content: this.infoWindowDiv()
    });
  },
  /*** Create markers for each of the places searched ***/
  addPlaceResultsCallBack: function(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      this.createMapMarker(results);
    }
  },
  createMapMarker: function (places) {
    var self = this;
    // Save google place address
    if (places[0].vicinity !== undefined) {
        self.vicinity(places[0].vicinity);
    }
    // Save google place information to be used to call Foursquare api
    this.name = places[0].name;
    this.types = places[0].types;
    this.latitude = places[0].geometry.location.lat();
    this.longitude = places[0].geometry.location.lng();
    this.newCenter = new google.maps.LatLng(this.latitude, this.longitude);
    this.geometryLocation = places[0].geometry.location;
    this.panoRadius = 10; // use to determine the panorama image
    // Create a marker for the place
    self.marker = new google.maps.Marker({
      map: map,
      position: places[0].geometry.location,
      title: places[0].name
    });
    // Use default icon from Foursquare
    var icon = new google.maps.MarkerImage(places[0].icon, null, null, null, new google.maps.Size(25, 25));
    self.marker.setIcon(icon);
    // Set marker to the center of the map
    map.setCenter(this.newCenter);
    // Define an event to display infoWindow when a marker is clicked
    google.maps.event.addListener(self.marker, 'click', function () {
      self.markerOpen(!self.markerOpen());
    });

    if (self.markerOpen()) {
      self.infoWindow.open(map, self.marker);
    }
    // Obtain name from Foursquare API
    self.setFoursquareInfo();
  },
  // Call Foursquare API and obtain the name of the location
  setFoursquareInfo: function() {
    var self = this;
    self.getFourSquareInfo().done(function(data) {
      var venues = data.response.venues;
      self.name = venues[0].name;
      self.receivedFourSquareUpdate(true);
    }).fail(function (jqxhr, textStatus, error) {
        self.fourSquareError('<span class="error">' + ' Error encountered from Foursquare. Please try again. ' + '</span>');
        self.name = '';
        self.receivedFourSquareUpdate(true);
        var err = textStatus + ',' + error;
        console.log('Request Failed: ' + err);
    });
  },
  getFourSquareInfo: function() {
    return $.ajax({
        url: FOURSQUARE_BASE_URL,
        type: 'GET',
        dataType: 'jsonp',
        contentType: 'application/json',
        data: {
          client_id: FOURSQUARE_CLIENT_ID,
          client_secret: FOURSQUARE_CLIENT_SECRET,
          ll: this.latitude + ',' + this.longitude,
          query: self.name,
          radius: 50,
          v: FOURSQUARE_VERSION,
          m: FOURSQUARE_MODE
        }
    });
  }
};


/***
 This is the ViewModel instantiated by the ko.bindings that uses the UnionCityPlaceModel object. It
 iterates through each of the desired locations for the Union City neighborhood
 and uses its methods to create markers and infoWindow for that location and
 call the Foursquare API to get its name.
 ***/
var UnionCityPlaceViewModel = function () {
  var self = this;
  self.allUnionCityPlaces = ko.observableArray([]);

  /* Update the current location in the ViewModel when  marker is clicked */
  self.subscribeToMapClick = function (place) {
    place.markerOpen.subscribe(function (markerOpen) {
      if (markerOpen) {
          self.setCurrentPlace(place);
      } else {
          self.closeInfoWindow(place);
      }
    });
  };

  /*** Update the Infowindow when getting updates from Foursequare data ***/
  self.subscribeToFourSquareUpdate = function (place) {
    place.receivedFourSquareUpdate.subscribe(function (receivedFourSquareUpdate) {
      if (receivedFourSquareUpdate && place.infoWindow) {
        place.infoWindow.setContent(place.infoWindowDiv());
        /*** update panoramic view ***/
        if (place.markerOpen()) {
          self.getPanoramaImage();
        }
      }
    });
  };

  /* pushes new location and adds subscriptions above */
  self.addPlace = function (place) {
      self.subscribeToMapClick(place);
      self.subscribeToFourSquareUpdate(place);
      place.markerOpen(true);
  };


  /* Close current window to open new one */
  self.closeInfoWindows = function () {
    var infoLength = self.allUnionCityPlaces().length;
    for (i = 0; i < infoLength; i++) {
      if (self.allUnionCityPlaces()[i].infoWindow && self.allUnionCityPlaces()[i] !== self.currentPlace()) {
          self.allUnionCityPlaces()[i].markerOpen(false);
      }
    }
  };

  self.closeInfoWindow = function (place) {
    if (place.infoWindow && !place.markerOpen()) {
        place.infoWindow.close();
    }
  };

  self.currentPlace = ko.observable();

  self.setCurrentPlace = function (place) {
    self.currentPlace(place);
    self.closeInfoWindows();

    place.infoWindow.setContent(self.currentPlace().infoWindowDiv());
    place.infoWindow.open(map, place.marker);

    /***
    use the place latitude and longitude from Google search
    to obtain new panoramic image
    ***/
    if (place.geometryLocation) {
      self.getPanoramaImage();
    }
  };

  self.toggleInfoWindow = function (place) {
    place.markerOpen(!place.markerOpen());
  };

  self.getPanoramaImage = function () {
      sv.getPanoramaByLocation(self.currentPlace().geometryLocation, self.currentPlace().panoRadius, self.processSVData);
  };

  /* searches for the closest panoramic image available */
  self.processSVData = function (data, status) {
    if (status === google.maps.StreetViewStatus.OK) {
      $('#panoError').removeClass('unhide');
      panorama.setPano(data.location.pano);
      var heading = google.maps.geometry.spherical.computeHeading(data.location.latLng, self.currentPlace().geometryLocation);
      panorama.setPov({
          heading: heading,
          pitch: 0
      });
      panorama.setVisible(true);
    } else if (status === google.maps.StreetViewStatus.ZERO_RESULTS) {
        /* increase the radius needed to search for this pano */
        self.currentPlace().panoRadius += 40;
        self.getPanoramaImage();
    } else {
        $('#panoError').addClass('unhide');
    }
  };

  /***
    Iterate through each of the locations in Union City to create
    markers, infoWindows, information from Foursquare and an estimated
    panoramic view
  ***/
  var currentPlace;
  for (var i = 0; i < initialUnionCityPlaces.length; i++) {
      currentPlace = new UnionCityPlaceModel(initialUnionCityPlaces[i]);
      currentPlace.init();
      self.allUnionCityPlaces.push(currentPlace);
      self.subscribeToMapClick(currentPlace);
      self.subscribeToFourSquareUpdate(currentPlace);
  }

  google.maps.event.addListener(searchBox, 'places_changed', function () {
    var places = searchBox.getPlaces();
    if (places.length === 0) {
        return;
    }
    var newPlace = new UnionCityPlaceModel({name: places[0].name, types: places[0].types});
    newPlace.init();
    self.addPlace(newPlace);
  });

};

window.addEventListener('load', function() {
  var status = document.getElementById("status");

  function updateOnlineStatus(event) {
    var condition = navigator.onLine ? "online" : "offline";

    status.className = condition;
    status.innerHTML = condition.toUpperCase();

    log.insertAdjacentHTML("beforeend", "Event: " + event.type + "; Status: " + condition);
  }

  window.addEventListener('online',  updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
});

/*** Load the map of Union City ***/
google.maps.event.addDomListener(window, 'load', initializeMap);


/* delay this to allow time for google maps to add divs to the map */
setTimeout(function () {
    ko.applyBindings(new UnionCityPlaceViewModel());
}, 1000);