Template.resourcesPostEdit.onCreated(function() {
		
	if (Session.get("fileId"))
		delete Session.keys["fileId"]; // Clear fileId session

	if (Session.get("fileExt"))
		delete Session.keys["fileExt"]; // Clear fileExt session

	imageExtensions = ["jpg","jpeg","png","gif"];
});


Template.resourcesPostEdit.onRendered(function() {
			
	Uploader.finished = function(index, fileInfo) { // Triggered when image upload is finished
	// TODO : don't upload image before submit post (or remove after if post isn't submitted)	

		var fileName = fileInfo.name.substr(0, fileInfo.name.lastIndexOf('.')) || fileInfo.name;
		var fileExt = fileInfo.name.substr(fileInfo.name.lastIndexOf('.')+1).toLowerCase();

		Session.set("fileId",fileInfo.fileId);
		Session.set("fileName",fileInfo.fileName);
		Session.set("fileExt",fileInfo.fileExt);
		Session.set("filePath",fileInfo.path);
	}
	
	Deps.autorun(function() { // Autorun to reactively update subscription of file
		if (Session.get("fileId")) {
			Meteor.subscribe('allFiles');
		}
	});
});


Template.resourcesPostEdit.events({

	'submit form': function(e) {
		e.preventDefault();
	
		var currentPostId = Session.get('postToEdit');
		var currentPost = Posts.findOne(currentPostId);

		var set = {};

		var title = $(e.target).find('[name=title]').val();
		if (title != currentPost.title) // If body has changed, replace by new one
			_.extend(set, {title: title});

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
				$('#resourcesPostEdit').modal('hide');
			}
		});
	},
	'click .resources-post-edit--retry': function(e) {
		e.preventDefault();
		Session.set("fileId",null); // Clear fileId session
		Session.set("fileName",null); // Clear fileId session
		Session.set("fileExt",null); // Clear fileId session
		Session.set("filePath",null); // Clear fileId session
		$('.resources-post-edit--submit').prop('disabled', false);
	},
	'click .resources-post-edit--submit': function(e) {
		e.preventDefault();
		$('#resources-post-edit--form').submit();

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
		$('.resources-post-edit--submit').prop('disabled', true);
	},
	'click .post-submit--button-delete-file': function(e) {
		e.preventDefault();
		if (confirm(TAPi18n.__('post-submit--confirm-delete-file'))) {
			Session.set('fileId', false);
		}
		$('.resources-post-edit--submit').prop('disabled', true);
	}
});


Template.resourcesPostEdit.helpers({

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
				$('.resources-post-edit--submit').prop('disabled', false);
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
	// categories: function() {
	// 	var currentPostId = Session.get('postToEdit');
	// 	var currentPost = Posts.findOne(currentPostId);
	// 	return Categories.find({spaceId: currentPost.spaceId},{sort: { name: 1 }});  
	// },
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
      		type: "resource"
    	}
  	}
});