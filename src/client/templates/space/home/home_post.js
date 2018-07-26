Template.homePost.events({

	'click .home-post--edit': function(e) {
		e.preventDefault();
		
		var postId = this._id;
		Session.set('postToEdit',postId);
		Session.set('fileId', false);

		if (Posts.findOne(postId).fileId) {// If image already exist, set fileId + fileExt in session
			Session.set('fileId', Posts.findOne(postId).fileId);
			Session.set('fileExt', Posts.findOne(postId).fileExt);
		}

		$('#homePostEdit').modal('show');

		$('#homePostEdit').on('shown.bs.modal', function (e) {
			tinymce.init({
			  	selector: 'textarea#body-edit-tinymce',
			  	skin_url: '/packages/teamon_tinymce/skins/lightgray',
			});
		});

		$('#homePostEdit').on('hidden.bs.modal', function (e) {
			tinymce.remove( "textarea#body-edit-tinymce" );
		});

	},
	'click .home-post--delete': function(e) {
		e.preventDefault();
		
		var postId = this._id;
		Session.set('postToDelete',postId);
		$('#homePostDelete').modal('show');
	}
});