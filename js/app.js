/**
 * Create a namespace for functions and variables
 * @namespace app
 */

 var app = app || {};

 /**
 * High level function to execute modular functions
 */
function initialize() {
    'use strict';
    // Default map center; Union City CA
    app.unioncityCenter = new google.maps.LatLng(37.593392, -122.043830)
    // Create a map of union city using html element map-canvas
    app.map = app.getGoogleMap(document.getElementById('map-canvas'));
    // Add restaurant markers to the map of union city
    app.addRestaurants();
    // Apply Knockout bindings
    //ko.applyBindings(app.RestaurantViewModel);
}

//Load the map of Union City
google.maps.event.addDomListener(window, 'load', initialize);


/**
 * Create a KnockoutJS view model to be able to click or search a restaurant
 */

app.Restaurant = function(data) {
  this.restaurant = ko.observable(data.name);
}

app.RestaurantViewModel = function() {

  var self = this;

  self.query = ko.observable("");

  app.places.forEach(function(restaurantItem) {
    self.restaurants.push( new app.Restaurant(restaurantItem) );
  });

  /**
  self.restaurants = ko.dependentObservable(function() {
    var search = this.query().toLowerCase();
      return ko.utils.arrayFilter(app.places, function(place) {
        return place.name.toLowerCase().indexOf(search) >= 0;
      });
  }, app.RestaurantViewModel);
  */
}

/**
 * Create a map object added to the namespace app
 */
app.getGoogleMap = function(mapDiv) {
    // Configure and add map to map div.
    var mapOptions = {
        center: app.unioncityCenter,
        zoom: 15
    };
    return new google.maps.Map(mapDiv, mapOptions);
};

/**
 * Add restaurants to the map object
 */
app.addRestaurants = function() {
  // Define request parameters
  var request = {
      location: app.unioncityCenter,
      radius: 500,
      types: ['restaurant']
  };
  // Define google service for nearby search with callback to process results
  var service = new google.maps.places.PlacesService(app.map);
  service.nearbySearch(request, app.callback);
}

/**
 * Iterate through the results objects and create a marker
 * Save the results objects to an array to be displayed in a list
 */
app.places = [];
app.callback = function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    console.log('results',results);
    for (var i = 0; i < results.length; i++) {
      app.createMarker(results[i]);
      app.places.push(results[i]);
    }
    app.displayListOfRestaurants();
  }
}

/**
 * Add a marker to each of the restaurants found
 * Define an event to open a window to display basic info about a restaurant
 * when marker is clicked
 */
app.currentMarker = null;
app.createMarker = function(place) {
  var placeLoc = place.geometry.location;
  var marker = new google.maps.Marker({
      map: app.map,
      animation: google.maps.Animation.DROP,
      position: place.geometry.location,
      title: place.name
  });
  // Add a listener whenever a restaurant marker is clicked
  google.maps.event.addDomListener(marker, 'click', function() {
    app.displayInfoWindow(place, marker);
  });
}

/**
 * Create an infowindow for each restaurant marker
 */
 app.displayInfoWindow = function(place, marker) {
  // if app.infoWindow exists, close it
  if (app.infoWindow) {
    app.infoWindow.close();
  }
  app.infoWindow = new google.maps.InfoWindow({
    content: [
        '<img src="' ,
        place.icon,
        '" /><font style="color:#000;">',
        place.name,
        '<br />Vicinity: ',
        place.vicinity,
        '</font>'
                  ].join('')
  });
  app.infoWindow.open(app.map, marker);

  /**
   * Animate the marker that's clicked to bounce.
   * If there is an active marker, deactivate the bounce.
   * Otherwise, bounce the marker.
  */
  if(app.currentMarker != null) {
    app.currentMarker.setAnimation(null);
  }

  marker.setAnimation(google.maps.Animation.BOUNCE);
  app.currentMarker = marker;
}

/**
 * Display same restaurant in a list
 */
app.displayListOfRestaurants = function() {
  var listItem;
  var displayItem;

  /**
   * Iterate through the array of restaurants saved from app.createMarker
   * and append to an unordered list
   */
  for (var i = 0; i < app.places.length; i++) {
      listItem = app.places[i].name;
      displayItem = '<li class="article">' +
                    '<span >' +
                    listItem +
                    '</span></li>';
      $('#placeId').append(displayItem);
  }
}
