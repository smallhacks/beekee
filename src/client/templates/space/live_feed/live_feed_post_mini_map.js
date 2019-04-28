Template.liveFeedPostMiniMap.onCreated(function() {

	// Inizialize GoogleMaps mini map
	//GoogleMaps.load({key:'AIzaSyB5jOArX4Iwin0qRYpnvnYJ3EwrYQO8OP4'});

 //   	GoogleMaps.ready('miniMap', function(map) {
 //    		minimap = map.instance
	// });
});

Template.liveFeedPostMiniMap.onRendered(function() {

  	// GoogleMaps initialization
});

Template.liveFeedPostMiniMap.events({

	'click .live-feed-post-submit--form': function(e, template) {
		 e.preventDefault();

		var author = Session.get(this.space._id).author; 
		var body = $('[name=body]').val();
		var spaceId = template.data.space._id;
		var fileId = Session.get("fileId");
		var fileName = Session.get("fileName");
		var fileExt = Session.get("fileExt");
		var filePath = Session.get("filePath");

		var latitude = marker.position.lat();
		var longitude = marker.position.lng();

		//var filePath = escape(Session.get("filePath"));

		//var tags = $(e.target).find('[name=tags]').val().toLowerCase().replace(/ /g,'').split(',');
		var category = $(e.target).find('[name=categorySelect]').val();

		// TODO : check how imagesToDelete work
		// var imagesToDelete = Session.get('imagesToDelete');
		// imagesToDelete.forEach(function(imageId) {
		// 		Images.remove(imageId);
		// });

		Meteor.call('postInsert', {author: author, body: body, spaceId: spaceId, type: "liveFeed", fileId: fileId, fileName: fileName, fileExt: fileExt, filePath: filePath, category: category, latitude: latitude, longitude:longitude}, function(error, postId) {
			if (error){
				alert(TAPi18n.__('error-message')+error.message);
			} else {
				$(e.target).find('[name=body]').val('');

				if (Session.get('liveFeedCategory') == '') // Unless a category is filtered, change select to empty category
					$(e.target).find('[name=categorySelect]').val(TAPi18n.__('post-submit--no-category'));

				Session.set("fileId",null); // Clear fileId session
				Session.set("fileName",null); // Clear fileId session
				Session.set("fileExt",null); // Clear fileId session
				Session.set("filePath",null); // Clear fileId session

				delete Session.keys["fileId"]; // Clear fileId session
				delete Session.keys["fileName"]; // Clear fileId session
				delete Session.keys["fileExt"]; // Clear fileId session
				delete Session.keys["filePath"]; // Clear fileExt session
				liveFeedResetPostsServerNonReactive();

				$('#liveFeedPostMiniMap').modal('hide');
			};
		});
	},
		'click .live-feed-post-submit--locate-me': function(e) {
		 e.preventDefault();

		// Show a spinner while tracking
		$(".live-feed-post-submit--locate-me-icon").addClass("d-none");
		$(".live-feed-post-submit--spinner").removeClass("d-none");

		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(savePosition);
		} else {
			alert("Geolocation is not supported by this browser.");

  			// Hide the spinner
			$(".live-feed-post-submit--locate-me-icon").removeClass("d-none");
			$(".live-feed-post-submit--spinner").addClass("d-none");
		}
		function savePosition(position) {

			var newLatitude = position.coords.latitude;
			var newLongitude = position.coords.longitude;
    		
    		var latlng = new google.maps.LatLng(newLatitude, newLongitude);

  			marker.setPosition(latlng);
  			minimap.setCenter(latlng);

  			// Hide the spinner
			$(".live-feed-post-submit--locate-me-icon").removeClass("d-none");
			$(".live-feed-post-submit--spinner").addClass("d-none");
		}
	},
});


Template.liveFeedPostMiniMap.helpers({

	miniMapOptions: function() {
    // Make sure the maps API has loaded
    if (GoogleMaps.loaded()) {
      // Map initialization options
      return {
        center: new google.maps.LatLng(46.194365399999995, 6.140539),
        zoom: 11,
        streetViewControl: false
      };
    }
  }
 });