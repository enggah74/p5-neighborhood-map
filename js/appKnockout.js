
  var map;
  var infowindow;
  var restaurantInfo;


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
      }
      displayPlaces(results);

    }
  }

  function createMarker(place) {
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
      map: map,
      position: place.geometry.location,
      title: place.name
    });

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

  function displayPlaces(places) {
      var listItem = place.name;
      var displayItem = '<li class="list-group-item" data-bind="text: name">' + listItem + '</li>';
      $('#wikipedia-links').append(displayItem);
  }

  google.maps.event.addDomListener(window, 'load', initialize);

