## Website Performance Optimization portfolio project

### Project Overview

You will develop a single page application featuring a map of your neighborhood or a neighborhood you would like to visit. You will then add additional functionality to this map including highlighted locations, third-party data about those locations and various ways to browse the content.


### How the code is organized

1. Create an html file to include sections to display a search input box, a list of locations, the Google Maps and the Panoramic image.
1. Define specific locations for Union City and the variables needed to call the FoursquareAPI.
1. Define map variables and the lat/lng of Union City CA to create a google map using Google Maps.
1. Define a search box to use autocomplete using the list of specified Union City locations.
1. Define a panoramic view of the location using Go
1. Create a Model of each each location using KnockoutJS including all objects needed when the values change.
1. Then using Prototype property, define all the functions needed to create the markers, call Foursquare to obtain the venue name, create and format infoWindow of each location and update the panoramic view of a location.
1. Create the Model-View-View-Model to bind the model objects to the HTML by iterating each location for Union City. A Google Map is created using Google Maps API and a list of the locations is displayed with the name coming from Foursquare.
1. Listeners are also added when a marker on the map is clicked or a location is clicked on the list.

### List of APIs used
* Google Map Places API
* Google Map Search API
* Google Map Panorama API
* Foursequare API

### Helpful Resources
http://www.sitepoint.com/understanding-knockout/

1. Google Map
* https://developers.google.com/maps/tutorials/fundamentals/adding-a-google-map
* http://tutsme-webdesign.info/customization-of-a-google-map/
* https://developers.google.com/maps/documentation/javascript/streetview
* https://jsfiddle.net/53x4us89/1/
* http://www.latlong.net/
* http://googlegeodevelopers.blogspot.co.uk/2012/05/google-places-api-search-refinements-as.html
* https://developers.google.com/places/supported_types
* http://stackoverflow.com/questions/8189126/google-places-api-types-functionality
* https://stackoverflow.com/questions/12856232/google-places-api-not-able-to-display-all-search-results
* https://developers.google.com/maps/documentation/javascript/examples/places-searchbox
* http://www.w3schools.com/googleAPI/ref_mapoptions.asp
* http://www.latlong.net/
* http://stackoverflow.com/questions/2832636/google-maps-api-v3-getbounds-is-undefined
* http://jsfiddle.net/gaby/22qte/

1. Yelp API

http://discussions.udacity.com/t/im-having-trouble-getting-started-using-apis/13597

* https://github.com/ddo/oauth-1.0a
* https://answers.atlassian.com/questions/245979/how-to-get-consumer-key-and-secret-key
* http://www.script-tutorials.com/google-places-api-practice/comment-page-1/
* http://www.charlesnurse.com/Blog/Post/445/It-s-a-Knockout-7-Adding-items-to-and-Removing-items-from-Observable-Arrays
* http://oauth.googlecode.com/svn/code/javascript/example/
* http://jsfiddle.net/mythical/XJEzc/       (search w/ knockout)
* http://www.wrapcode.com/knockoutjs/communication-between-multiple-view-models-in-knockoutjs-mvvm-the-right-approach/
* https://www.airpair.com/knockout/posts/top-10-mistakes-knockoutjs
* http://blog.scottlogic.com/2014/02/28/developing-large-scale-knockoutjs-applications.html


1. KnockoutJS
* http://stackoverflow.com/questions/28794863/need-help-knockout-js-observablearray-with-google-maps-api
* https://github.com/lerniri/frontend-nanodegree-neighborhood-map/blob/master/js/app.js
* http://hoonzis.blogspot.com/2012/03/knockoutjs-and-google-maps-binding.html
* http://jsfiddle.net/rniemeyer/FcSmA/
* http://jsfiddle.net/8j7g08qr/1/
* http://sameersegal.github.io/KnockOutTweety/

1. Foursquare
* https://foursquare.com/developers/apps

1. Very Useful Resource where I got most of the code
* https://github.com/tenchjames/udacity-frontend-nano-neighborhoodmap/blob/master/src/js/app.js   (foursquare)
* http://antjanus.com/blog/web-development-tutorials/build-a-to-do-application-using-knockoutjs/
* http://stackoverflow.com/questions/10797728/why-is-root-required-here
* http://tenchjames.github.io/map/








