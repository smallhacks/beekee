// Global helpers

// Check in settings.json if the server is a box or a web server
Template.registerHelper("isBox", function () {
    return (Meteor.settings.public.isBox === "true");
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
	console.log("postsServerNonReactive : "+Session.get('postsServerNonReactive'));
	console.log("postsLimit : "+Session.get('postsLimit'));

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
		else if (Session.get('tag') !== "") {
			var tag = Session.get('tag');
			Session.set('postsServerNonReactive', Tags.findOne({name:tag}).nRefs);
		}
		else if (Session.get('pinned') == true) {
			Session.set('postsServerNonReactive', PinnedCounts.findOne().count);
		}
		else if (Session.get('files') == true) {
			Session.set('postsServerNonReactive', FilesCounts.findOne().count);
		}		
		else if (Session.get('images') == true) {
			Session.set('postsServerNonReactive', ImagesCounts.findOne().count);
		}
		else
			Session.set('postsServerNonReactive', Counts.findOne().count);

		resetPostInterval();
	}


resetFilters = function() {
	//Session.set('last',false);
	Session.set('pinned',false);
	Session.set('favorites',false);
	Session.set('files',false);
	Session.set('images',false);
	Session.set('author','');
	Session.set('tag','');
	Session.set('category','');
}