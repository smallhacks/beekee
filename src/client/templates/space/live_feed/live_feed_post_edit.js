Template.liveFeedPostEdit.onCreated(function() {
		
	if (Session.get("fileId"))
		delete Session.keys["fileId"]; // Clear fileId session

	if (Session.get("fileExt"))
		delete Session.keys["fileExt"]; // Clear fileExt session

	imageExtensions = ["jpg","jpeg","png","gif"];
});


Template.liveFeedPostEdit.onRendered(function() {
			
	Uploader.finished = function(index, fileInfo) { // Triggered when image upload is finished
	// TODO : don't upload image before submit post (or remove after if post isn't submitted)	

		Session.set("fileId",fileInfo.fileId);
		Session.set("fileName",fileInfo.fileName);
		Session.set("fileExt",fileInfo.fileExt);
		Session.set("filePath",fileInfo.path);
	}
	
	Deps.autorun(function() { // Autorun to reactively update subscription of file
		if (Session.get("fileId")) {
			Meteor.subscribe('file', Session.get("fileId"));
		}
	});
});


Template.liveFeedPostEdit.events({

	'submit form': function(e) {
		e.preventDefault();
	
		var currentPostId = Session.get('postToEdit');
		var currentPost = Posts.findOne(currentPostId);

		var set = {};

		var body = $(e.target).find('[name=body]').val();
		if (body != currentPost.body) // If body has changed, replace by new one
			_.extend(set, {body: body});

		var category = $(e.target).find('[name=category]').val();
		if (category != currentPost.category) {
			_.extend(set, {category: category})

			var oldCategoryItem = Categories.findOne({spaceId: currentPost.spaceId, name: currentPost.category}); // Decrement category
			if (oldCategoryItem)
				Categories.update(oldCategoryItem._id, {$inc: {nRefs: -1}}); 

			var newCategoryItem = Categories.findOne({spaceId: currentPost.spaceId, name: category}); // Increment category
			if (newCategoryItem)
				Categories.update(newCategoryItem._id, {$inc: {nRefs: 1}});    
		}

		// TODO : don't remove an image before form is submitted

		var fileId = Session.get("fileId");
		var fileName = Session.get("fileName");
		var fileExt = Session.get("fileExt");
		var filePath = Session.get("filePath");

		if (fileId == "" || fileId == false) {
			fileId = false;
			fileExt = false;
		}
		_.extend(set, {fileId: fileId, fileName: fileName, fileExt: fileExt, filePath: filePath});

		Posts.update(currentPostId, {$set: set}, function(error) {
			if (error) {
				alert(TAPi18n.__('error-message')+error.message);
			} else {
				resetPostsServerNonReactive();
				$('#liveFeedPostEdit').modal('hide');
			}
		});
	},
	'click .live-feed-post-edit--submit': function(e) {
		e.preventDefault();
		$('#live-feed-post-edit--form').submit();

		if (Session.get("fileId")) {
			delete Session.keys["fileId"]; // Clear fileId session
			Session.set("fileId",false);
		}

		if (Session.get("fileExt")) {
			delete Session.keys["fileExt"]; // Clear fileExt session
			Session.set("fileExt",false);
		}
	},
	'click .post-submit--button-delete-image': function(e) {
		e.preventDefault();
		if (confirm(TAPi18n.__('post-submit--confirm-delete-file'))) {
			Posts.update(Template.currentData()._id, {$unset: {'fileId': ''}});
			Session.set('fileId', false);
		}
	},
	'click .live-feed-post-edit--retry': function(e) {
		e.preventDefault();
		Session.set("fileId",null); // Clear fileId session
		Session.set("fileName",null); // Clear fileId session
		Session.set("fileExt",null); // Clear fileId session
		Session.set("filePath",null); // Clear fileId session
		$('.live-feed-post-edit--submit').prop('disabled', false);
	},
	'click .post-submit--button-delete-file': function(e) {
		e.preventDefault();
		if (confirm(TAPi18n.__('post-submit--confirm-delete-file'))) {
			Session.set('fileId', false);
		}  
	}
});


Template.liveFeedPostEdit.helpers({

	post: function() {
		var postId = Session.get('postToEdit');
		return Posts.findOne(postId);
	},
	fileUploaded: function() {
		if (Session.get("fileId")) {
			var fileId = Session.get("fileId");

			// Wait until file is in Files collection
			var fileInCollection = Files.findOne({_id:fileId});
			if (fileInCollection && !fileInCollection.error) {
				$('.live-feed-post-edit--submit').prop('disabled', false);
			}
			return fileInCollection;
		}
		else
			return false;
	},
	filePath:function() {
		return escape(Session.get("filePath"));
	},
	file: function() {
		if (Session.get("fileExt") && $.inArray(Session.get("fileExt"), imageExtensions) == -1 )
			return true;
	},
	image: function() {
		if (Session.get("fileExt") && $.inArray(Session.get("fileExt"), imageExtensions) != -1 )
			return Session.get("fileId");
	},
	space: function() {
		var currentPostId = Session.get('postToEdit');
		var currentPost = Posts.findOne(currentPostId);
		var spaceId = Spaces.findOne(currentPost.spaceId);
		return spaceId;
	},
	categories: function() {
		var currentPostId = Session.get('postToEdit');
		var currentPost = Posts.findOne(currentPostId);
		if (currentPost)
			return Categories.find({spaceId: currentPost.spaceId},{sort: { name: 1 }});  
	},
	selectedCategory: function(){
		var currentPostId = Session.get('postToEdit');
		var currentPost = Posts.findOne(currentPostId);
		var category = this.name;

		var categoryItem = currentPost.category;

		return category === categoryItem;
	},
	formData: function() {
    	return {
     		spaceId: this.space._id,
      		type: "liveFeed"
    	}
  	}
});