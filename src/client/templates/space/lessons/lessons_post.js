Template.lessonsPost.events({

	'click .lessons-post--edit': function(e) {
		e.preventDefault();
		
		var postId = this._id;
		Session.set('postToEdit',postId);
		Session.set('fileId', false);
		Session.set('fileName', false);
		Session.set('fileExt', false);
		Session.set('filePath', false);
		
		if (Posts.findOne(postId).fileId) {// If image already exist, set fileId + fileExt in session
			Session.set('fileId', Posts.findOne(postId).fileId);
			Session.set('fileName', Posts.findOne(postId).fileName);
			Session.set('fileExt', Posts.findOne(postId).fileExt);
			Session.set('filePath', Posts.findOne(postId).filePath);
		}

		$('#lessonsPostEdit').modal('show');
	},
	'click .lessons-post--delete': function(e) {
		e.preventDefault();
		
		var postId = this._id;
		Session.set('postToDelete',postId);
		$('#lessonsPostDelete').modal('show');
	}
});