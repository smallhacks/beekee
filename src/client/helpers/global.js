// Global helpers

// Check in settings.json if the server is a box or a web server
Template.registerHelper("isBox", function () {
    return (Meteor.settings.public.isBox === "true");
});


Template.registerHelper("ownSpace", function () {

	var spaceId = Session.get('spaceId');
	var spaceUserId = Spaces.findOne(spaceId).userId;

	var userId = Meteor.userId();
	var isAdmin = Roles.userIsInRole(Meteor.userId(), ['admin'])
	if (userId)
		if (spaceUserId === userId)
			return true;
	else if (isAdmin)
		if (isAdmin === true)
			return true;
	else
		return false;
});


resetPostInterval = function() { // Reset interval of post subscription
	if (Session.get('postsServerNonReactive') >= 10) {
		Session.set('postsToSkip',Session.get('postsServerNonReactive') - 10);
		Session.set('postsLimit',10);
	}
	else if (Session.get('postsServerNonReactive') >= 1 && Session.get('postsServerNonReactive') < 10) {
		Session.set('postsToSkip',0);
		Session.set('postsLimit',Session.get('postsServerNonReactive'));
	}
	else {
		Session.set('postsToSkip',0);
		Session.set('postsLimit',1);
	}
}


resetPostsServerNonReactive = function() { 
		if (Session.get('author') !== "") {
			var author = Session.get('author');
			Session.set('postsServerNonReactive', Authors.findOne({name:author}).nRefs);
		}
		else if (Session.get('category') !== "") {
			var category = Session.get('category');
			Session.set('postsServerNonReactive', Categories.findOne({name:category}).nRefs);
		}
		else
			Session.set('postsServerNonReactive', LiveFeedCounts.findOne().count);

		resetPostInterval();
	}


resetFilters = function() {
	Session.set('author','');
	Session.set('category','');
}