Template.spacePage.onCreated(function() {

	viewport = document.querySelector("meta[name=viewport]");
	viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=4');

	Session.set('spaceId',this.data.space._id);
	resetFilters();
	Session.set('postsServerNonReactive', Counts.findOne().count); // Set a non-reactive counter of posts -> here = all server posts
	resetPostInterval();
	Session.set('last', true);

	this.autorun(function() { // Autorun to reactively update subscription (filtering + interval of loaded posts)

		var postsToSkip = Session.get('postsToSkip');
		var postsLimit = Session.get('postsLimit');

		var filters = {spaceId:Session.get('spaceId')};
		if (Session.get('author') != "")
			filters = {spaceId:Session.get('spaceId'), author:Session.get('author')}
		else if (Session.get('category') != "")
			filters = {spaceId:Session.get('spaceId'), category:Session.get('category')}
		else if (Session.get('tag') != "")
			filters = {spaceId:Session.get('spaceId'), tags:Session.get('tag')}
		else if (Session.get('pinned') == true) 
			filters = {spaceId:Session.get('spaceId'), pinned:true}
		else if (Session.get('files') == true) 
			filters = {spaceId:Session.get('spaceId'), $and : [{fileId:{$exists:true} },{fileId:{$ne:false} },{fileExt:{$nin : ["jpg","jpeg","png","gif"]}}]}
		else if (Session.get('images') == true) 
			filters = {spaceId:Session.get('spaceId'), $and : [{fileId:{$exists:true} },{fileId:{$ne:false} },{fileExt:{$in : ["jpg","jpeg","png","gif"]}}]}
		else if (Session.get('favorites') == true) {
			var favorites = Session.get(Session.get('spaceId')).favorites;
			if (favorites)
				filters = {_id:{$in: favorites}}
		}

 		// Interval of posts subscription : load every posts from "postsToSkip" (skip) to "postsLimit" (limit)
 		// By default, load the 10 last posts (skip : total posts - 10 / limit : 10)
 		// postsLimit (limit) is used to disable reactivity

 	// 	if (!Session.get('isReactive')) 
		// 	subscription = Meteor.subscribe('posts', filters, postsToSkip, postsLimit);
		// 	//subscription = Meteor.subscribe('posts', filters, postsToSkip, postsLimit2);
		// else
		if (Session.get('last') == true)
			subscription = Meteor.subscribe('posts', filters, postsToSkip, postsLimit);
		else
			subscription = Meteor.subscribe('posts', filters, 0, postsLimit);
	});
});


Template.spacePage.events({

	'click .button-ok-update-alert': function() {
		Meteor.users.update(Meteor.user()._id, {$set: {"profile.lastAlert": 1}});
	},
	'change #space-page--select-filter': function(e) {
		var val = $(e.target).val();
		if (val == "asc")
  			Session.set("last", true);
  		else
  			Session.set("last", false);
	},
	'click .button-send-to-api': function(e, template) {
			e.preventDefault();

			Meteor.call('sendSpace', {spaceId: template.data.space._id} );
		},
	'click .button-hide-code-panel': function(e) {
		e.preventDefault();

		$( "#codePanel" ).hide();

		Spaces.update(this.space._id, {$set : {codePanel : 0}});         
	},
	// 'click .space-page--posts-order': function(e) {
	// 	e.preventDefault();
	// 	Session.set('last', !Session.get('last'));
	// },
	'click .space-page--load-more': function(e) {
		e.preventDefault();
		
		// If user want to load more posts, it moves the interval (skip : -10 / limit : +10)
		if (Session.get("last") == true) {
			if (Session.get('postsToSkip') <= 10) {
				Session.set('postsLimit',Session.get('postsLimit')+Session.get('postsToSkip'));
				Session.set('postsToSkip', 0);
			}
			else {
				Session.set('postsLimit',Session.get('postsLimit')+10);
				Session.set('postsToSkip',Session.get('postsToSkip')-10);
			}
		}
		else {
			var serverPosts = 0;

			if (Session.get('author') !== "") {
				var author = Session.get('author');
				serverPosts = Authors.findOne({name:author}).nRefs;
			}
			else if (Session.get('category') !== "") {
				var category = Session.get('category');
				serverPosts = Categories.findOne({name:category}).nRefs;
			}
			else if (Session.get('tag') !== "") {
				var tag = Session.get('tag');
				serverPosts = Tags.findOne({name:tag}).nRefs;
			}
			else if (Session.get('pinned')) {
				serverPosts = PinnedCounts.findOne().count;
			}
			else if (Session.get('files')) {
				serverPosts = FilesCounts.findOne().count;
			}		
			else if (Session.get('images')) {
				serverPosts = ImagesCounts.findOne().count;
			}
			else if (Session.get('favorites')) {
				var favorites = Session.get(Template.parentData(1).space._id).favorites;
				serverPosts = favorites.length;
			}
			else
				serverPosts = Counts.findOne().count;

			var serverPostsDiff = serverPosts - Session.get('postsLimit');
			if (serverPostsDiff >= 10)
				Session.set('postsLimit',Session.get('postsLimit')+10);
			else
				Session.set('postsLimit',Session.get('postsLimit')+serverPostsDiff); // Increases the limit by taking into account the number of remaining posts
		}
	},
	'click .space-page--refresh': function(e) { // Refresh posts when user click on new messages button
		e.preventDefault();

		console.log("postLimit : "+ Session.get('postsLimit'));
		console.log("postsToSkip : "+ Session.get('postsToSkip'));
		console.log("postsServerNonReactive : "+Session.get('postsServerNonReactive'));

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
		else {
			Session.set('postsServerNonReactive', Counts.findOne().count);
		}


		resetPostsServerNonReactive();



		//resetPostInterval();
	}  
});


Template.spacePage.helpers({

	// initialLoadCompleted: function() { 
 //  		return subscription.ready();
 //  	},
	posts: function() {
		if (this.space !== undefined && Session.get('last') == "")
			//return Posts.find({},{sort: {pinned: -1, submitted: 1}});
			return Posts.find({pinned:false},{sort: {pinned: -1, submitted: 1}});
		else if (this.space !== undefined && Session.get('last') !== "")
			return Posts.find({pinned:false},{sort: {pinned: -1, submitted: -1}});
		else return null
	},
	postsPinned: function() {
		if (this.space !== undefined && Session.get('last') == "")
			//return Posts.find({},{sort: {pinned: -1, submitted: 1}});
			return Posts.find({pinned:true},{sort: {submitted: 1}});
		else if (this.space !== undefined && Session.get('last') !== "")
			return Posts.find({pinned:true},{sort: {submitted: -1}});
		else return null
	},
	loadMore: function() { // Check if user can load more posts

		var serverPosts = 0;

		if (Session.get('author') !== "") {
			var author = Session.get('author');
			serverPosts = Authors.findOne({name:author}).nRefs;
		}
		else if (Session.get('category') !== "") {
			var category = Session.get('category');
			serverPosts = Categories.findOne({name:category}).nRefs;
		}
		else if (Session.get('tag') !== "") {
			var tag = Session.get('tag');
			serverPosts = Tags.findOne({name:tag}).nRefs;
		}
		else if (Session.get('pinned')) {
			serverPosts = PinnedCounts.findOne().count;
		}
		else if (Session.get('files')) {
			serverPosts = FilesCounts.findOne().count;
		}		
		else if (Session.get('images')) {
			serverPosts = ImagesCounts.findOne().count;
		}
		else if (Session.get('favorites')) {
			var favorites = Session.get(Template.parentData(1).space._id).favorites;
			serverPosts = favorites.length;
		}
		else
			serverPosts = Counts.findOne().count;

		if (Session.get("last") == true) {
			var serverPostsDiff = serverPosts - Session.get('postsServerNonReactive'); // Check if there are new posts
			if (serverPostsDiff == 0 && serverPosts > Session.get('postsLimit')) // No new post & posts to load
				return true
			else if (serverPostsDiff > 0) {
				return (serverPosts - serverPostsDiff > Session.get('postsLimit')) // There are new posts, so we remove them from the count
			}
		}
		else {
			if (serverPosts > Session.get('postsLimit'))
				return true;
		}
	},
	ascendant: function() {
		if (Session.get('last'))
			return "selected";
		else
			return null
	},
	descendant: function() {
		if (!Session.get('last'))
			return "selected";
		else
			return null
	},
	codePanelState: function() {
		return (this.space.codePanel)
	},
	ownSpace: function() {
		var userId = Meteor.userId();
		var isAdmin = Roles.userIsInRole(Meteor.userId(), ['admin'])
		if (userId)
			if (this.space.userId === userId)
				return true;
		else if (isAdmin)
			if (isAdmin === true)
				return true;
		else
			return false;
	},
	newMessages: function() { // Check if server posts  > client posts (if reactive is on)

		// var nbPosts = Session.get('postsServerNonReactive');
		// console.log("nbPosts : "+nbPosts);
		// var postsReactiveCount = Counts.findOne().count;
		// var postLoaded = Session.get('postsLimit');
		// console.log("postLoaded : "+postLoaded);


		// if (nbPosts < postLoaded && nbPosts != 0)
		// 	return (postLoaded - nbPosts);
		// else
		// 	return false;
		if (Session.get("last") == true) {

			var nbPosts = Session.get('postsServerNonReactive');
			var postsReactiveCount;

			if (Session.get('author') !== "") {
				var author = Session.get('author');
				postsReactiveCount = Authors.findOne({name:author}).nRefs;  
			}
			else if (Session.get('category') !== "") {
				var category = Session.get('category');
				postsReactiveCount = Categories.findOne({name:category}).nRefs;  
			}
			else if (Session.get('tag') !== "") {
				var tag = Session.get('tag');
				postsReactiveCount = Tags.findOne({name:tag}).nRefs;  
			}
			else if (Session.get('pinned') == true) {
				postsReactiveCount = PinnedCounts.findOne().count;  
			}
			else if (Session.get('files') == true) {
				postsReactiveCount = FilesCounts.findOne().count;  
			}
			else if (Session.get('images') == true) {
				postsReactiveCount = ImagesCounts.findOne().count;  
			}
			else if (Session.get('favorites') == true) {
				var favorites = Session.get(Template.parentData(1).space._id).favorites;
				postsReactiveCount = favorites.length;  
			}
			else {
				postsReactiveCount = Counts.findOne().count;
			}

			if (nbPosts < postsReactiveCount) {
				// If there is no post on the client and one is published, the client will load it reactively.
				// postsServerNonReactive stays at 0 because there is no refresh, so we have to update it manually.
				if (nbPosts == 0) { 
					Session.set('postsServerNonReactive', postsReactiveCount);
				}
				else
					return (postsReactiveCount - nbPosts);
			}
			else
				return false;
		}
		else
			return false;
	},
	isReactive: function() {
		return Session.get('isReactive');
	},
    updateAlert: function() {
    	if (Meteor.user()) {
      		if (Meteor.user().profile) {
        		if (Meteor.user().profile.lastAlert >= 1)
          			return false
        		else
          			return true
    		}
      		else return false
      	}
        else return false
    }
});