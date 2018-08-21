Template.liveFeedPostDelete.events({

	'click .live-feed-post-delete--confirm': function(e) {
		e.preventDefault();

		var currentPostId = Session.get("postToDelete");
		var currentPost = Posts.findOne(currentPostId);

		Posts.remove(currentPostId, function(error) {
			if (error)
				alert(TAPi18n.__('error-message')+error.message);
			else {
				liveFeedResetPostsServerNonReactive();
				$('#liveFeedPostDelete').modal('hide');
			}
		});
	}
});