Template.liveFeedPostSubmit.onCreated(function() {

	// reCAPTCHA initialization
	reCAPTCHA.config({
        publickey: Meteor.settings.public.recaptchapublickey,
        hl: 'fr' // optional display language
    });

		if (Session.get("fileId"))
			delete Session.keys["fileId"]; // Clear fileId session

		if (Session.get("fileExt"))
			delete Session.keys["fileExt"]; // Clear fileExt session

		Session.set("body","");

	imageExtensions = ["jpg","jpeg","png","gif"];
});


Template.liveFeedPostSubmit.onRendered(function() {

	$('.post-submit--textarea').autosize(); // Set textarea height automatically according to text size

	Deps.autorun(function() { // Autorun to reactively update subscription of file
		if (Session.get("fileId"))
			Meteor.subscribe('file', Session.get("fileId"));
	});

	Uploader.finished = function(index, fileInfo, templateContext) { // Triggered when file upload is finished
	// TODO : don't upload file before submit post (or remove after if post isn't submitted)	
	// It seems that this event is overriden by live_feed_post_edit.js
		
		Session.set("fileId",fileInfo.fileId);
		Session.set("fileName",fileInfo.fileName);
		Session.set("fileExt",fileInfo.fileExt);
		Session.set("filePath",fileInfo.path);
		Session.set("thumbPath",fileInfo.thumbPath);
	}

	// Set default author if not defined
	if (Template.parentData(2))
		if (!Session.get(Template.parentData(2).space._id))
			Session.set(Template.parentData(2).space._id, {author: 'Invité'});

	// Initialize Google Maps mini map when modal is showed
	GoogleMaps.load({key:Meteor.settings.public.googlemapskey});

	// Add default marker
	GoogleMaps.ready('submitMiniMap', function(map) {

		// var icon = {
  //   		url: "/img/marker.png", // url
  //   		scaledSize: new google.maps.Size(30, 40), // scaled size
  //   		origin: new google.maps.Point(0,0), // origin
  //   		anchor: new google.maps.Point(15, 40) // anchor
		// };
    	
    	submitMiniMap = map.instance;

    	var latlng = new google.maps.LatLng(46.205525, 6.144801);
  		submitMiniMap.setCenter(latlng);
    	
  //   	if (typeof submitMiniMapMarker == 'undefined') {
  // 			submitMiniMapMarker = new google.maps.Marker({
		//  		position: new google.maps.LatLng(46.205525, 6.144801),
		//       	draggable: true,
		//       	map: map.instance,
		//       	icon: icon
		//    	});
		// } else {
		// 	// Reset marker and map position
		// 	var latlng = new google.maps.LatLng(46.205525, 6.144801);
  // 			submitMiniMap.setCenter(latlng);
	 //  		submitMiniMapMarker.setMap(submitMiniMap);
		// }
	});

	$('#liveFeedPostSubmitMiniMap').on('shown.bs.modal', function (e) {
		var latlng = new google.maps.LatLng(46.205525, 6.144801);
		submitMiniMap.setCenter(latlng);

		// Reset the miniMarker position when modal is opened
		// if (typeof submitMiniMapMarker != 'undefined') {
		// 	var latlng = new google.maps.LatLng(46.205525, 6.144801);
  // 			submitMiniMapMarker.setPosition(latlng);
  // 			submitMiniMap.setCenter(latlng);
  // 			submitMiniMapMarker.setMap(submitMiniMap);
		// }
	});
});


Template.liveFeedPostSubmit.events({

	'click .live-feed-post-submit--show-mini-map': function(e) {
		e.preventDefault();

		$('#liveFeedPostSubmitMiniMap').modal('show');


		// reCAPTCHA
     //    var captchaData = grecaptcha.getResponse();
     //    Meteor.call('checkCaptcha', captchaData, function(error, result) {
     //        // reset the captcha
     //        grecaptcha.reset();

     //        if (error) {
     //            console.log('There was an error: ' + error.reason);
     //        } else {
     //        	if (result == true)
					// $('#liveFeedPostSubmitMiniMap').modal('show');
     //        }
     //    });
	},
	'click .live-feed-post-submit--button-submit': function(e) {
		e.preventDefault();
		$('#live-feed-post-submit--form').submit();
	},
	'click .post-submit--button-delete-image': function(e) {
		e.preventDefault();
		if (confirm(TAPi18n.__('post-submit--confirm-delete-image'))) {
			Session.set('fileId', false);
		}  
	},
	'click .post-submit--button-delete-file': function(e) {
		e.preventDefault();
		if (confirm(TAPi18n.__('post-submit--confirm-delete-file'))) {
			Session.set('fileId', false);
		}  
	},
	'click .live-feed-post-submit--retry': function(e) {
		e.preventDefault();
		Session.set("fileId",null); // Clear fileId session
		Session.set("fileName",null); // Clear fileId session
		Session.set("fileExt",null); // Clear fileId session
		Session.set("filePath",null); // Clear fileId session
		$('.live-feed-post-submit--button-submit').prop('disabled', false);
	},
	'change #categorySelect': function(e) {
		if ($(e.target).val() == "add-category") {
			$('#liveFeedCategorySubmit').modal('show');
		}
	}
});


Template.liveFeedPostSubmit.helpers({

	// image: function() {
	// 	if (Session.get("fileId") && $.inArray(Session.get("fileExt"), imageExtensions) != -1 ) {
	// 		var fileId = Session.get("fileId");
	// 		var fileInCollection = Files.findOne({fileId:fileId});

	// 		if (fileInCollection) // Wait until file is in Files collection
	// 			$(".post-submit--button-submit").show();
	// 		return fileInCollection;
	// 	}
	// 	else
	// 		return false;
	// },
	fileUploaded: function() {
		if (Session.get("fileId")) {
			var fileId = Session.get("fileId");

			// Wait until file is in Files collection
			var fileInCollection = Files.findOne({_id:fileId});
			if (fileInCollection && !fileInCollection.error) {
				$('.live-feed-post-submit--button-submit').prop('disabled', false);
			}
			return fileInCollection;
		}
		else
			return false;
	},
	file: function() {
		if (Session.get("fileExt") && $.inArray(Session.get("fileExt"), imageExtensions) == -1 )
			return true;
	},
	filePath:function() {
		return escape(Session.get("filePath"));
	},
	image: function() {
		if (Session.get("fileExt") && $.inArray(Session.get("fileExt"), imageExtensions) != -1 )
			return Session.get("fileId");
	},
	categories: function() {
		return Categories.find({spaceId: this.space._id, type:"liveFeed"},{sort: { name: 1 }});  
	},
	selectedOption: function(option) {
		if (Session.get('liveFeedCategory') == option)
			return 'selected'
	},
	liveFeedAddCategory: function(template) {
		if (this.space.permissions.liveFeedAddCategory || Roles.userIsInRole(Meteor.userId(), ['admin']) || Meteor.userId() == this.space.userId)
			return true
		else
			return false
	},
	formData: function() {
    	return {
     		spaceId: this.space._id,
      		type: "liveFeed"
    	}
  	},
});