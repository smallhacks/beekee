Template.liveFeed.onRendered(function() {

	$('.modal').on('shown.bs.modal', function (e) {
		  $(this).find('[autofocus]').focus();
	});

	liveFeedResetFilters();
	if (Template.parentData(1).space.permissions && Template.parentData(1).space.userId != Meteor.userId() && Roles.userIsInRole(Meteor.userId(), ['admin']) != true) {
		if (Template.parentData(1).space.permissions.needValidation) {
			Session.set('postsServerNonReactive', LiveFeedValidatedCounts.findOne().count); // Set a non-reactive counter of posts -> here = all server posts
		} else
			Session.set('postsServerNonReactive', LiveFeedCounts.findOne().count); // Set a non-reactive counter of posts -> here = all server posts
	} else
		Session.set('postsServerNonReactive', LiveFeedCounts.findOne().count); // Set a non-reactive counter of posts -> here = all server posts

	liveFeedResetPostInterval();

	this.autorun(function() { // Autorun to reactively update subscription (filtering + interval of loaded posts)

		var postsToSkip = Session.get('postsToSkip');
		var postsLimit = Session.get('postsLimit');

		var filters = {spaceId:Session.get('spaceId'), type:"liveFeed"};
		if (Session.get('author') != "")
			filters = {spaceId:Session.get('spaceId'), type:"liveFeed", author:Session.get('author')};
		else if (Session.get('liveFeedCategory') != "") {
			filters = {spaceId:Session.get('spaceId'), type:"liveFeed", category:Session.get('liveFeedCategory')};
		}

		// Filter posts if needValidation is set to true (posts are not filters if admin or teacher)
		if (Template.parentData(1).space.permissions && Template.parentData(1).space.userId != Meteor.userId() && Roles.userIsInRole(Meteor.userId(), ['admin']) != true) {
			//if (Template.parentData(1).space.permissions.needValidation) {
				filters.published = true;
			//}
		}

 		// Interval of posts subscription : load every posts from "postsToSkip" (skip) to "postsLimit" (limit)
 		// By default, load the 10 last posts (skip : total posts - 10 / limit : 10)
 		// postsLimit (limit) is used to disable reactivity
		subscription = Meteor.subscribe('posts', filters, postsToSkip, postsLimit);
	});

	// // Initialize Google Maps mini map when modal is showed
	// GoogleMaps.load({key:Meteor.settings.public.googlemapskey});

	// 	GoogleMaps.ready('miniMap', function(map) {
	// 		console.log("defined");
 //    	miniMap = map.instance;
 //  			miniMapMarker = new google.maps.Marker({
	// 	      position: new google.maps.LatLng(40, 40),
	// 	      draggable: false,
	// 	      map: miniMap
	// 	   });
	// });



	// Initialize Google Maps mini map
	// GoogleMaps.load({key:Meteor.settings.public.googlemapskey});

	// GoogleMaps.ready('miniMap', function(map) {

 //    	miniMap = map.instance;

	// 	// Add first clicked post marker
 //  		miniMapMarker = new google.maps.Marker({
	// 	    position: new google.maps.LatLng(Session.get("postLocalization").latitude, Session.get("postLocalization").longitude),
	// 	    draggable: false,
	// 	    map: map.instance
	// 	});
		
	// 	// Center the map on the marker
	// 	var latlng = new google.maps.LatLng(Session.get("postLocalization").latitude, Session.get("postLocalization").longitude);
 //  		miniMap.setCenter(latlng);

 //  		// Add an event that is fired when a modal is shown
 //  		// Set the new position of the marker
	// 	$('#liveFeedPostMiniMap').on('show.bs.modal', function (e, template) {

	// 		miniMapMarker.setPosition( new google.maps.LatLng(Session.get("postLocalization").latitude, Session.get("postLocalization").longitude) );
			
	// 		var latlngEvent = new google.maps.LatLng(Session.get("postLocalization").latitude, Session.get("postLocalization").longitude);
 //  			miniMap.setCenter(latlngEvent);
	// 	});
	// });
});


Template.liveFeed.events({

	'click .live-feed--refresh': function(e) { // Refresh posts when user click on new messages button
		e.preventDefault();

		if (Session.get('author') !== "") {
			var author = Session.get('author');
			Session.set('postsServerNonReactive', Authors.findOne({name:author}).nRefs);
		}
		else if (Session.get('liveFeedCategory') !== "") {
			var category = Session.get('liveFeedCategory');
			Session.set('postsServerNonReactive', Categories.findOne({name:category}).nRefs);
		}
		else {

	if (Template.parentData(1).space.permissions && Template.parentData(1).space.userId != Meteor.userId() && Roles.userIsInRole(Meteor.userId(), ['admin']) != true) {
		if (Template.parentData(1).space.permissions.needValidation) {
			Session.set('postsServerNonReactive', LiveFeedValidatedCounts.findOne().count); // Set a non-reactive counter of posts -> here = all server posts
		} else
			Session.set('postsServerNonReactive', LiveFeedCounts.findOne().count); // Set a non-reactive counter of posts -> here = all server posts
	} else
		Session.set('postsServerNonReactive', LiveFeedCounts.findOne().count); // Set a non-reactive counter of posts -> here = all server posts
		}

		liveFeedResetPostsServerNonReactive();
	},
	'click .live-feed--load-more': function(e) {
		e.preventDefault();
		
		// If user want to load more posts, it moves the interval (skip : -10 / limit : +10)
		if (Session.get('postsToSkip') <= 10) {
			Session.set('postsLimit',Session.get('postsLimit')+Session.get('postsToSkip'));
			Session.set('postsToSkip', 0);
		}
		else {
			Session.set('postsLimit',Session.get('postsLimit')+10);
			Session.set('postsToSkip',Session.get('postsToSkip')-10);
		}
	}
});


Template.liveFeed.helpers({

	liveFeedAddPost: function() {
		return Template.parentData(1).space.permissions.liveFeedAddPost || Template.parentData(1).space.userId === Meteor.userId() || Roles.userIsInRole(Meteor.userId(), ['admin']) === true;
	},
	liveFeedPosts: function() {
		return Posts.find({type:"liveFeed"},{sort: {submitted: -1}});
	},
	newMessages: function() { // Check if server posts  > client posts (if reactive is on)

		var nbPosts = Session.get('postsServerNonReactive');
		var postsReactiveCount;

		if (Session.get('author') !== "") {
			var author = Session.get('author');
			if (Authors.findOne({name:author}))
				postsReactiveCount = Authors.findOne({name:author}).nRefs;  
		}
		else if (Session.get('liveFeedCategory') !== "") {
			var category = Session.get('liveFeedCategory');
			if (Categories.findOne({name:category}))
				postsReactiveCount = Categories.findOne({name:category}).nRefs;  
		}
		else {
		if (Template.parentData(1).space.permissions && Template.parentData(1).space.userId != Meteor.userId() && Roles.userIsInRole(Meteor.userId(), ['admin']) != true) {
			if (Template.parentData(1).space.permissions.needValidation) {
				postsReactiveCount = LiveFeedValidatedCounts.findOne().count;
			} else {
				postsReactiveCount = LiveFeedCounts.findOne().count;
			}
		} else
			postsReactiveCount = LiveFeedCounts.findOne().count;
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
	},
	loadMore: function() { // Check if user can load more posts

		var serverPosts = 0;

		if (Session.get('author') !== "") {
			var author = Session.get('author');
			if (Authors.findOne({name:author}))
				serverPosts = Authors.findOne({name:author}).nRefs;
		}
		else if (Session.get('liveFeedCategory') !== "") {
			var category = Session.get('liveFeedCategory');
			if (Categories.findOne({name:category}))
				serverPosts = Categories.findOne({name:category}).nRefs;
		}
		else {
				if (Template.parentData(1).space.permissions && Template.parentData(1).space.userId != Meteor.userId() && Roles.userIsInRole(Meteor.userId(), ['admin']) != true) {
		if (Template.parentData(1).space.permissions.needValidation) {
			serverPosts = LiveFeedValidatedCounts.findOne().count;
		} else
			serverPosts = LiveFeedCounts.findOne().count;
	} else
			serverPosts = LiveFeedCounts.findOne().count;
		}

		var serverPostsDiff = serverPosts - Session.get('postsServerNonReactive'); // Check if there are new posts
		if (serverPostsDiff == 0 && serverPosts > Session.get('postsLimit')) // No new post & posts to load
			return true
		else if (serverPostsDiff > 0) {
			return (serverPosts - serverPostsDiff > Session.get('postsLimit')) // There are new posts, so we remove them from the count
		}
	},
});


liveFeedResetPostInterval = function() { // Reset interval of post subscription
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


liveFeedResetPostsServerNonReactive = function() { 
		if (Session.get('author') !== "") {
			var author = Session.get('author');
			Session.set('postsServerNonReactive', Authors.findOne({name:author}).nRefs);
		}
		else if (Session.get('liveFeedCategory') !== "") {
			var category = Session.get('liveFeedCategory');
			Session.set('postsServerNonReactive', Categories.findOne({name:category}).nRefs);
		}
		else {
			var space = Spaces.findOne(Session.get('spaceId'));
	if (space.permissions && space.userId != Meteor.userId() && Roles.userIsInRole(Meteor.userId(), ['admin']) != true) {
		if (space.permissions.needValidation) {
			Session.set('postsServerNonReactive', LiveFeedValidatedCounts.findOne().count); // Set a non-reactive counter of posts -> here = all server posts
		} else
			Session.set('postsServerNonReactive', LiveFeedCounts.findOne().count); // Set a non-reactive counter of posts -> here = all server posts
	} else
		Session.set('postsServerNonReactive', LiveFeedCounts.findOne().count); // Set a non-reactive counter of posts -> here = all server posts

			//Session.set('postsServerNonReactive', LiveFeedCounts.findOne().count);
		}

		liveFeedResetPostInterval();
	}


liveFeedResetFilters = function() {
	Session.set('author','');
	Session.set('liveFeedCategory','');
}