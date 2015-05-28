
  var map;
  var infowindow;
  var restaurantInfo;

  // YELP Authentication tokens
  var YELP_BASE_URL = 'http://api.yelp.com/v2/search';
  var YELP_KEY = 'O1rWaoR54AYSYRwVt_j0UA';
  var YELP_TOKEN = 'Qlgr-Q-besAEJD0DgzroM6Odd1cp_SX9';
  var YELP_KEY_SECRET = 'jIL0YvUYF5XVbty6rGAsGehGl2c';
  var YELP_TOKEN_SECRET = 'KTU76LW--FsB88wuiW2nVo-pJCs';


  /**
   * Generates a random number and returns it as a string for OAuthentication
   * @return {string}
   */
  function nonce_generate() {
    return (Math.floor(Math.random() * 1e12).toString());
  }

  // Obtain authentication before using yelp api
  function obtainYelpInfo(name) {

    var yelp_url = YELP_BASE_URL;

    var parameters = {
      oauth_consumer_key: YELP_KEY,
      oauth_token: YELP_TOKEN,
      oauth_nonce: nonce_generate(),
      oauth_timestamp: Math.floor(Date.now()/1000),
      oauth_signature_method: 'HMAC-SHA1',
      oauth_version : '1.0',
      location: 'Union City CA',
      term: name,
      limit: 1,
      callback: 'cb'              // This is crucial to include for jsonp implementation in AJAX or else the oauth-signature will be wrong.
    };

    var encodedSignature = oauthSignature.generate('GET', yelp_url, parameters, YELP_KEY_SECRET, YELP_TOKEN_SECRET);
    parameters.oauth_signature = encodedSignature;

    // Ajax call to yelp to obtain info about the restaurant
    var settings = {
      url: yelp_url,
      data: parameters,
      cache: true,                // This is crucial to include as well to prevent jQuery from adding on a cache-buster parameter "_=23489489749837", invalidating our oauth-signature
      dataType: 'jsonp',
      success: function(results) {
        var info = results.businesses;
        restaurantInfo = {
          name: info.display_name,
          phone: info.display_phone,
          address: info.display_address,
          rating: info.rating,
          snippet_text: info.snippet_text,
          img_url: info.img_url
        }
      },
      error:function(jqXHR, textStatus, errorThrown) {
        var err = textStatus + ", " + errorThrown;
        restaurantInfo = {error: 'Not Found'};
      }
    };

    // Send AJAX query via jQuery library.
    $.ajax(settings);

  }

  // Windows calls initialize to draw the map and obtain the different restaurants based on the location
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

  function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        createMarker(results[i]);
        displayPlaces(results[i]);
      }
    }
  }

  function createMarker(place) {
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
      map: map,
      position: place.geometry.location,
      title: place.name
    });

    obtainYelpInfo(place.name);

    // prepare info window
    var content = '<img src="' + place.icon + '" /><font style="color:#000;">' + place.name +
            '<br />Vicinity: ' + place.vicinity + '</font>';

    google.maps.event.addListener(marker, 'click', function() {
      infowindow.close();
      infowindow.setContent(content);
      infowindow.open(map, this);
      console.log("place="+place.name);
    });
  }

  function displayPlaces(place) {
      var listItem = place.name;
      var displayItem = '<li id="item" class="article">' + listItem + '</li>';
      $('#wikipedia-links').append(displayItem);
  }

  google.maps.event.addDomListener(window, 'load', initialize);

