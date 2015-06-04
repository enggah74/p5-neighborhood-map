/**
 * Create a namespace for functions and variables
 * @namespace app
 */

var app = app || {};

// Foursquare url credentials
var FOURSQUARE_BASE_URL = 'https://api.foursquare.com/v2/venues/search';
var FOURSQUARE_CLIENT_ID = 'R42ZEH51THS5SGBYAXFED5Y4FDPQDM3CE5H3RKIRICXX5QD3';
var FOURSQUARE_CLIENT_SECRET = 'JQ45ALHZFKTXREINGXUBQNA3YIJGWHOUFGA3TE4P0G2OV22V';
var FOURSQUARE_MODE = 'foursquare';
var FOURSQUARE_DEFAULT_ICON = 'https://foursquare.com/img/categories/food/default_64.png';

// Obtain date needed for version in foursquare url
var formattedDate = getFormattedDate();

/**
* High level function to execute modular functions
*/
function initialize() {
  'use strict';
  // Default map center; Union City CA
  app.unioncityCenter = new google.maps.LatLng(37.593392,-122.043830)
  // Create a map of union city using html element map-canvas
  app.map = app.getGoogleMap(document.getElementById('map-canvas'));
  // Create street view map of Union City CA
  app.getStreetViewMap(document.getElementById('pano'));
  // Add restaurant markers to the map of union city
  app.addRestaurants();
  // Define viewModel object for ko data binders
  app.viewModel = new Model();
  // Populate restaurants array
  app.places.forEach(function(place) {
    app.viewModel.restaurants.push(place);
  });
  // Apply Knockout bindings to display a list of restaurants
  ko.applyBindings(app.viewModel);
}

//Load the map of Union City
google.maps.event.addDomListener(window, 'load', initialize);


/**
 * Create a KnockoutJS view model to be able to click or search a restaurant
 */
function Model() {
  var self = this;
  self.query = ko.observable("");
  self.restaurants = ko.observableArray();
}


  /**
  self.restaurants = ko.dependentObservable(function() {
    var search = this.query().toLowerCase();
      return ko.utils.arrayFilter(app.places, function(place) {
        return place.name.toLowerCase().indexOf(search) >= 0;
      });
  }, app.RestaurantViewModel);



/**
 * Create a map object added to the namespace app
 * for map view
 */
app.getGoogleMap = function(mapDiv) {
    // Configure and add map to map div
    var mapOptions = {
        center: app.unioncityCenter,
        zoom: 15
    };
    return new google.maps.Map(mapDiv, mapOptions);
};


/**
 * Obtain street view
 */
app.getStreetViewMap = function(panoDiv) {
    // Configure and add map to pano div
    var panoramaOptions = {
      position: app.unioncityCenter,
      pov: {
        heading: 34,
        pitch: 10
      }
    };
    var panorama = new google.maps.StreetViewPanorama(document.getElementById('pano'), panoramaOptions);
    app.map.setStreetView(panorama);
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
      app.addFoursquareInfo(results[i],i);
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
        FOURSQUARE_DEFAULT_ICON,
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

/**
 * Obtain information about each place using the lat/lon and name
 * and save to an array of objects
 */
app.foursquarePlaces = [];
app.addFoursquareInfo = function(place, index) {
  // format the foursquare url
  var foursquare_url = FOURSQUARE_BASE_URL
                    + '?client_id=' + FOURSQUARE_CLIENT_ID
                    + '&client_secret=' + FOURSQUARE_CLIENT_SECRET
                    + '&m=' + FOURSQUARE_MODE
                    + '&llAcc=5'
                    + '&section=food'
                    + '&v=' + formattedDate
                    + '&ll=' + place.geometry.location.A + ',' + place.geometry.location.F
                    + '&query=' + place.name
                    + '&limit=1';

  // Ajax call to foursquare to obtain info about the restaurant via jQuery library
  $.ajax({
      url: foursquare_url,
      dataType: 'json',
      success:function(results) {
        var name = place.name;
        var address = place.vicinity;
        var venueName;

        /**
         * Store place object in foursquare array if warning exists or the name from foursquare
         * does not match the place object name. Otherwise, replace the place object with the
         * name and address from fourquare object.
         */

        if (results.response.warning) {
          console.log("google name not found="+place.name+" [place]=", place);
        } else {
          venueName = results.response.venues[0].name;
          console.log("ready google name="+name + " [venue name]="+venueName);
          if ( venueName.indexOf(name) ) {
            console.log("matched google name="+name + " [venue]="+venueName);
            name = venueName;
            address = results.response.venues[0].location.address + " " + results.response.venues[0].location.city;
          } else {
              console.log("not matched google name ="+name+ " [venue]=" + venueName);
          }
        }
        app.foursquarePlaces[index] = { name: name, address: address };
      }
  });

}

function getFormattedDate() {

  var formattedDate;
  var date = new Date();
  var year = date.getFullYear();
  var month = (1 + date.getMonth()).toString();
  var day = date.getDate().toString();

  month = month.length > 1 ? month : '0' + month;
  day = day.length > 1 ? day : '0' + day;
  formattedDate = year + month + day;

  return formattedDate;
}
