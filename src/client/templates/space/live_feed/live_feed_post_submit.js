Template.liveFeedPostSubmit.onCreated(function() {

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
		
		Session.set("fileId",fileInfo.fileId);
		Session.set("fileName",fileInfo.fileName);
		Session.set("fileExt",fileInfo.fileExt);
		Session.set("filePath",fileInfo.path);
	}

	// Set default author if not defined
	if (Template.parentData(2))
		if (!Session.get(Template.parentData(2).space._id))
			Session.set(Template.parentData(2).space._id, {author: 'Invité'});

	// Initialize Google Maps mini map when modal is showed
	$('#liveFeedPostMiniMap').on('shown.bs.modal', function (e) {
		GoogleMaps.load({key:Meteor.settings.googlemapskey});

		// Add default marker
		GoogleMaps.ready('miniMap', function(map) {
    		minimap = map.instance;
  				marker = new google.maps.Marker({
		      	position: new google.maps.LatLng(46.2055549, 6.1445332),
		      	draggable: true,
		      	map: map.instance
		    });
		});
	});
});


Template.liveFeedPostSubmit.events({

	'click .live-feed-post-submit--show-mini-map': function(e) {
		e.preventDefault();
		$('#liveFeedPostMiniMap').modal('show');
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