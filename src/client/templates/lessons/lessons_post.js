Template.lessonsPost.events({

	'click .lessons-post--delete': function(e,postid) {
		e.preventDefault();
		
		var postId = $(e.currentTarget).data("postid");
		Session.set('postToDelete',postId);
		$('#lessonsPostDelete').modal('show');
	}
});