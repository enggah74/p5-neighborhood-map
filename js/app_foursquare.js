
  // Global variables
  var map;
  var infowindow;
  var restaurantInfo;
  var content;
  var currentMarker = null;

  // Foursquare constant values
  var FOURSQUARE_BASE_URL = 'https://api.foursquare.com/v2/venues/search';
  var FOURSQUARE_CLIENT_ID = 'R42ZEH51THS5SGBYAXFED5Y4FDPQDM3CE5H3RKIRICXX5QD3';
  var FOURSQUARE_CLIENT_SECRET = 'JQ45ALHZFKTXREINGXUBQNA3YIJGWHOUFGA3TE4P0G2OV22V';
  var FOURSQUARE_DEFAULT_ICON = 'https://foursquare.com/img/categories/food/default_64.png';
  var FOURSQUARE_VENUE = 'Union City, CA';


  /**
    Windows calls initialize to draw the map of Union City and obtain the different restaurants.
  **/
  function initialize() {
    var unioncity = new google.maps.LatLng(37.593392, -122.043830);

    map = new google.maps.Map(document.getElementById('map-canvas'), {
      center: unioncity,
      zoom: 15
    });

    var request = {
      location: unioncity,
      radius: 500,
      types: ['restaurant']
    };

    infowindow = new google.maps.InfoWindow();
    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, callback);
  }


  /**
    Iterate through the results from the nearby search from google map places service api,
    create markers and infowindow for each restaurant and display a list of the restaurants.
  **/
  function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        createMarker(results[i]);
        displayPlaces(results[i]);
      }
    }
  }

  /**
    This function creates the map, calls the Foursquare API for more restaurant info instead
    of using the google map places information, and responds to a click event on a marker to
    display info about the restaurant.
  **/
  function createMarker(place) {
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
      map: map,
      animation: google.maps.Animation.DROP,
      position: place.geometry.location,
      title: place.name
    });

    google.maps.event.addListener(marker, 'click', function() {

      // Call Foursquare API to store json results into the variable, restaurantInfo
      restaurantInfo = obtainFoursquareInfo(place.name);

      /**var content = '<img src="' + place.icon + '" /><font style="color:#000;">' + place.name +
      //        '<br />Vicinity: ' + place.vicinity + '</font>';
      // prepare info window
      **/

      var content = '<img src="' + FOURSQUARE_DEFAULT_ICON + '" /><font style="color:#000;">' + restaurantInfo.name +
              '<br />' + restaurantInfo.category +
              '<br />Address: ' + restaurantInfo.address + ' ' + restaurantInfo.city + ' ' + restaurantInfo.zip +
              '<br />Phone: ' + restaurantInfo.phone +
              '<br />Web: ' + restaurantInfo.url +
              '</font>';

      // remove the bounce from the "old" marker
      stopAnimation();

      // add a bounce to this marker
      marker.setAnimation(google.maps.Animation.BOUNCE);

      infowindow.close();
      infowindow.setContent(infoContent);
      infowindow.open(map, this);
      // set this marker to the currentMarker
      currentMarker = marker;
      console.log("place="+place.name);
    });


  }

  function displayPlaces(place) {
      var listItem = place.name;
      var displayItem = '<li id="item" class="article">' + listItem + '</li>';
      $('#wikipedia-links').append(displayItem);
  }


  // Call Foursquare api via ajax to return info about a restaurant near Union City CA
  function obtainFoursquareInfo(name) {

    var formattedDate = getFormattedDate();

    // format foursquare url
    var foursquare_url = FOURSQUARE_BASE_URL
                        + '?client_id=' + FOURSQUARE_CLIENT_ID
                        + '&client_secret=' + FOURSQUARE_CLIENT_SECRET
                        + '&v=' + formattedDate
                        + '&near=' + FOURSQUARE_VENUE
                        + '&query=' + name
                        + '&limit=1';

    console.log("[url]="+foursquare_url);

    // Ajax call to foursquare to obtain info about the restaurant via jQuery library
    $.ajax({
        url: foursquare_url,
        dataType: 'json',
        success:function(results) {
          var restaurantInfo;

          $.each(results.response.venues, function(i, venue) {

            restaurantInfo = {
              name: venue.name,
              phone: venue.contact.formattedPhone,
              address: venue.location.address,
              city: venue.location.city,
              state: venue.location.state,
              zip: venue.location.postalCode,
              category: venue.categories[0].name,
              url: venue.url
            }

            console.log("[venue]="+i, venue);

          });

          return restaurantInfo;

      }
    });

  }

  function stopAnimation() {
      currentMarker && currentMarker.setAnimation(null);
      currentMarker = null;
  }

  function getFormattedDate() {

    var date = new Date();
    var year = date.getFullYear();

    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;

    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;

    return year + month + day;
  }

  google.maps.event.addDomListener(window, 'load', initialize);

