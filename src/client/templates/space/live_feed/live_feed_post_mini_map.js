Template.liveFeedPostMiniMap.helpers({

	miniMapOptions: function() {

    // Make sure the maps API has loaded
    if (GoogleMaps.loaded()) {
      // Map initialization options
      return {
        center: new google.maps.LatLng(46.205525, 6.144801),
        zoom: 11,
        streetViewControl: false
      };
    }
  }
 });