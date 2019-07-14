Template.liveFeedPostSubmitMiniMap.onCreated(function() {
	toastr.options = {
	  	"positionClass": "toast-bottom-center",
	}
});

Template.liveFeedPostSubmitMiniMap.onRendered(function() {

  	// GoogleMaps initialization
});

Template.liveFeedPostSubmitMiniMap.events({

	'click .live-feed-post-submit--form': function(e, template) {
		 e.preventDefault();

		var author = Session.get(this.space._id).author; 
		var body = $('#body').val();
		var spaceId = template.data.space._id;
		var fileId = Session.get("fileId");
		var fileName = Session.get("fileName");
		var fileExt = Session.get("fileExt");
		var filePath = Session.get("filePath");
		var thumbPath = Session.get("thumbPath");

		needValidation = Template.parentData().space.permissions.needValidation;



		var mapLatLong = submitMiniMap.getCenter();
		console.log("mapLatLong : "+mapLatLong.lat());

		var latitude = mapLatLong.lat();
		var longitude = mapLatLong.lng();
		

		//var latitude = submitMiniMapMarker.position.lat();
		//var longitude = submitMiniMapMarker.position.lng();

		//var filePath = escape(Session.get("filePath"));

		//var tags = $(e.target).find('[name=tags]').val().toLowerCase().replace(/ /g,'').split(',');
		var category = $(e.target).find('[name=categorySelect]').val();

		// TODO : check how imagesToDelete work
		// var imagesToDelete = Session.get('imagesToDelete');
		// imagesToDelete.forEach(function(imageId) {
		// 		Images.remove(imageId);
		// });

		if (GoogleMaps.loaded()) {
	    			// Get reverse geocoding
	    var latlng = {lat: latitude, lng: longitude};
	    geocoder = new google.maps.Geocoder();
	    	geocoder.geocode({'location': latlng}, function(results, status) {
			if (status == 'OK') {
				const localityObject = results[0].address_components.filter((obj) => {
					return obj.types.includes('locality');
				})[0];
				//var locality = localityObject.long_name;
				var locality = localityObject.long_name;


		Meteor.call('postInsert', {author: author, body: body, spaceId: spaceId, type: "liveFeed", fileId: fileId, fileName: fileName, fileExt: fileExt, filePath: filePath, thumbPath: thumbPath, category: category, latitude: latitude, longitude:longitude, locality: locality}, function(error, postId) {
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

				$('#liveFeedPostSubmitMiniMap').modal('hide');

				if (needValidation)
					toastr.success("Elle devra être validée par un administrateur.","Votre photo a bien été soumise");
			};
		});

			}	
		});
	    }


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

  			//submitMiniMapMarker.setPosition(latlng);
  			submitMiniMap.setCenter(latlng);

  			// Hide the spinner
			$(".live-feed-post-submit--locate-me-icon").removeClass("d-none");
			$(".live-feed-post-submit--spinner").addClass("d-none");
		}
	},
});


Template.liveFeedPostSubmitMiniMap.helpers({

	submitMiniMapOptions: function() {
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