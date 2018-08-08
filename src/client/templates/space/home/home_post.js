Template.homePost.events({

	'click .home-post--order-up': function(e) {
		e.preventDefault();
		
		var post = this;

		if (this.order > 0) { // Check if post is not the first
			var postUpOrder = Posts.findOne({type:"home",order:this.order-1});

			Posts.update({_id:postUpOrder._id},{$set:{order:post.order}},function(err) {
				if (!err) {
					Posts.update({_id:post._id},{$set: {order:post.order-1}});
				}
			});
		}
	},
	'click .home-post--order-down': function(e) {
		e.preventDefault();

		var maxOrder = Posts.find({type:"home"},{sort:{order:-1},limit:1}).fetch();

		if (this.order < maxOrder[0].order) { // Check if post is not the last
			var post = this;
			var postDownOrder = Posts.findOne({type:"home",order:this.order+1});

			Posts.update({_id:postDownOrder._id},{$set:{order:post.order}},function(err) {
				if (!err) {
					Posts.update({_id:post._id},{$set: {order:post.order+1}});
				}
			});
		}
	},
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