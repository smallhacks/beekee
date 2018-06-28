Template.liveFeedPostSubmit.onCreated(function() {

		if (Session.get("fileId"))
			delete Session.keys["fileId"]; // Clear fileId session

		if (Session.get("fileExt"))
			delete Session.keys["fileExt"]; // Clear fileExt session

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
		Session.set("fileId",fileInfo.name);

		var extension = fileInfo.name.substr(fileInfo.name.lastIndexOf('.')+1).toLowerCase();
		Session.set("fileExt",extension);
	}

	// Set default author if not defined
	if (Template.parentData(2))
		if (!Session.get(Template.parentData(2).space._id))
			Session.set(Template.parentData(2).space._id, {author: 'Invité'});
});


Template.liveFeedPostSubmit.events({

	'submit form': function(e, template) {
		 e.preventDefault();

		//$(".post-submit--button-spinner").show(); // Show a spiner while sending
		//$(".post-submit--button-icon").hide();
		//$(".post-submit--button-text").hide();

		var author = Session.get(this.space._id).author;  
		var body = $(e.target).find('[name=body]').val();
		var spaceId = template.data.space._id;
		var fileId = Session.get("fileId");
		var fileExt = Session.get("fileExt");
		//var tags = $(e.target).find('[name=tags]').val().toLowerCase().replace(/ /g,'').split(',');
		var category = $(e.target).find('[name=categorySelect]').val();

		// TODO : check how imagesToDelete work
		// var imagesToDelete = Session.get('imagesToDelete');
		// imagesToDelete.forEach(function(imageId) {
		// 		Images.remove(imageId);
		// });

		Meteor.call('postInsert', {author: author, body: body, spaceId: spaceId, type: "liveFeed", fileId: fileId, fileExt: fileExt, category: category}, function(error, postId) {
			if (error){
				alert(TAPi18n.__('error-message')+error.message);
			} else {
				$(e.target).find('[name=body]').val('');

				if (Session.get('category') == '') // Unless a category is filtered, change select to empty category
					$(e.target).find('[name=categorySelect]').val(TAPi18n.__('post-submit--no-category'));

				Session.set("fileId",null); // Clear fileId session
				Session.set("fileExt",null); // Clear fileId session
				delete Session.keys["fileId"]; // Clear fileId session
				delete Session.keys["fileExt"]; // Clear fileExt session
				resetPostsServerNonReactive();

				//$(".post-submit--button-spinner").hide(); // Show a spiner while sending
			};
		});
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
			var fileInCollection = Files.findOne({fileId:fileId});

			if (fileInCollection) // Wait until file is in Files collection
				$(".post-submit--button-submit").show();
			return fileInCollection;
		}
		else
			return false;
	},
	file: function() {
		if (Session.get("fileExt") && $.inArray(Session.get("fileExt"), imageExtensions) == -1 )
			return true;
	},
	image: function() {
		if (Session.get("fileExt") && $.inArray(Session.get("fileExt"), imageExtensions) != -1 )
			return Session.get("fileId");
	},
	categories: function() {
		return Categories.find({spaceId: this.space._id},{sort: { name: 1 }});  
	},
	selectedOption: function(option) {
		if (Session.get('category') == option)
			return 'selected'
	},
	permissionAddCategories: function(template) {
		if (this.space.permissions.addCategories || Roles.userIsInRole(Meteor.userId(), ['admin']) || Meteor.userId() == this.space.userId)
			return true
		else
			return false
	}
});