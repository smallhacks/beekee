Template.postEdit.onCreated(function() {


		if (Session.get("fileId"))
			delete Session.keys["fileId"]; // Clear fileId session

		if (Session.get("fileExt"))
			delete Session.keys["fileExt"]; // Clear fileExt session

		imageExtensions = ["jpg","jpeg","png","gif"];
});


Template.postEdit.onRendered(function() {

	$('.post-edit--textarea').autosize(); // Set textarea height automatically according to text size

	 Session.set('fileId', false);
	 if (Posts.findOne(Template.currentData()._id).fileId) {// If image already exist, set fileId + fileExt in session
	 	Session.set('fileId', Posts.findOne(Template.currentData()._id).fileId);
	 	Session.set('fileExt', Posts.findOne(Template.currentData()._id).fileExt);
	 }

	Deps.autorun(function() { // Autorun to reactively update subscription of file
		if (Session.get("fileId"))
			Meteor.subscribe('file', Session.get("fileId"));
	});

	Uploader.finished = function(index, fileInfo, templateContext) { // Triggered when image upload is finished
	// TODO : don't upload image before submit post (or remove after if post isn't submitted)	
		Session.set("fileId",fileInfo.name);

		var extension = fileInfo.name.substr(fileInfo.name.lastIndexOf('.')+1).toLowerCase();
		Session.set("fileExt",extension);
	}

	// var tags = new Bloodhound({ // Allow to find and show tags in input if already exists
	// 	datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
	// 	queryTokenizer: Bloodhound.tokenizers.whitespace,
	// 	local: Tags.find().fetch()
	// });
	// tags.initialize();
	// $('.suggest').tagsinput({
	// 	typeaheadjs: {
	// 		name: 'tags',
	// 		displayKey: 'name',
	// 		valueKey: 'name',
	// 		source: tags.ttAdapter()
	// 	}, 
	// 	confirmKeys: [32, 9, 13, 44, 188]
	// });

	// $('.suggest').tagsinput('input').blur(function() {
	// 	$('.suggest').tagsinput('add', $(this).val().toLowerCase());
	// 	$(this).val('');
	// });
});


Template.postEdit.events({

	'submit form': function(e) {
		e.preventDefault();

		$(".post-edit--button-spinner").show(); // Show a spiner while sending
		$(".post-edit--button-icon").hide();
		$(".post-edit--button-text").hide();
	
		var currentPostId = this._id;
		var currentPost = Posts.findOne(currentPostId);

		// var oldTags = this.post.tags;
		// var newTags = $(e.target).find('[name=tags]').val().toLowerCase().replace(/ /g,'').split(',');
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

		// TODO : don't remove an image before form is submitted (check old git commits)

		var fileId = Session.get("fileId");
		var fileExt = Session.get("fileExt");
		if (fileId == "" || fileId == false) {
			fileId = false;
			fileExt = false;
		}
		_.extend(set, {fileId: fileId, fileExt: fileExt});

		Posts.update(currentPostId, {$set: set}, function(error) {
			if (error) {
				alert(TAPi18n.__('error-message')+error.message);
			} else {
				$.magnificPopup.close();
				resetPostsServerNonReactive();

				 		//Router.go('spacePage', {_id: currentPost.spaceId});  


				// Meteor.call('tagsEdit', {spaceId: spaceId, newTags: newTags, oldTags: oldTags}, function(error) {
				// 	if (error) {
    //       				alert("Une erreur est survenue : "+error.message);
				// 	} else {						
				// 		Router.go('spacePage', {_id: currentPost.spaceId});  
				// 	}
			 // 	});
			}
		});
	},
	'click .post-submit--button-submit': function(e) {
		e.preventDefault();
		$('#post-edit--form').submit();

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
	'click .post-submit--button-delete-file': function(e) {
		e.preventDefault();
		if (confirm(TAPi18n.__('post-submit--confirm-delete-file'))) {
			Session.set('fileId', false);
		}  
	}
});


Template.postEdit.helpers({

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
	post: function() {
		return Posts.findOne(Template.currentData()._id);
	},
	space: function() {
		var currentPostId = Template.currentData()._id;
		var currentPost = Posts.findOne(currentPostId);
		var spaceId = Spaces.findOne(currentPost.spaceId);
		return spaceId;
	},
	categories: function() {
		var currentPostId = Template.currentData()._id;
		var currentPost = Posts.findOne(Template.currentData()._id)
    	return Categories.find({spaceId: currentPost.spaceId},{sort: { name: 1 }});  
  	},
	selectedCategory: function(){
		var currentPostId = Template.parentData()._id;
		var currentPost = Posts.findOne(currentPostId);
		console.log("currentPostId : "+currentPostId);
		var category = this.name;

		var categoryItem = currentPost.category;

		return category === categoryItem;
	}
});