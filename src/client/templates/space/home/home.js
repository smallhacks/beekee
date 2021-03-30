// Copyright 2016-2020 UNIVERSITY OF GENEVA (GENEVA, SWITZERLAND)

// This file is part of Beekee Live.
    
// Beekee Live is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Beekee Live is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
//  along with Beekee Live.  If not, see <https://www.gnu.org/licenses/>.

//**************************************************************************


Template.home.onRendered(function() {

	$('.modal').on('shown.bs.modal', function (e) {
		  $(this).find('[autofocus]').focus();
	});

	liveFeedResetFilters();
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

 		// Interval of posts subscription : load every posts from "postsToSkip" (skip) to "postsLimit" (limit)
 		// By default, load the 10 last posts (skip : total posts - 10 / limit : 10)
 		// postsLimit (limit) is used to disable reactivity
		subscription = Meteor.subscribe('posts', filters, postsToSkip, postsLimit);
	});
});


Template.home.events({
	
	'click .home--submit': function(e) {
		e.preventDefault();
		
		$('#homePostSubmit').modal('show');

		tinymce.init({
		  	selector: 'textarea#body-submit-tinymce',
		  	skin_url: '/packages/teamon_tinymce/skins/lightgray',
		  	paste_data_images: true
		});

		$('#homePostSubmit').on('show.bs.modal', function (e) {
			tinymce.init({
		  		selector: 'textarea#body-submit-tinymce',
		  		skin_url: '/packages/teamon_tinymce/skins/lightgray',
		  		paste_data_images: true
			});
		})

		$('#homePostSubmit').on('hide.bs.modal', function (e) {
			tinymce.remove( "textarea#body-submit-tinymce" );
			
		})
	},
	'click .home--hide-code-panel':function(e) {
		e.preventDefault();

		Spaces.update({_id:this.space._id},{$set: {codePanel:false}});
	},
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
			Session.set('postsServerNonReactive', LiveFeedCounts.findOne().count);
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

Template.home.helpers({

	homePosts: function() {
		return Posts.find({type:"home"},{sort: {order: 1}});
	},
	homePostsEmpty: function() {
		return Posts.find({type:"home"},{sort: {order: 1}}).count() == 0;
	},
	codePanel: function() {
		return this.space.codePanel;
	},
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
			postsReactiveCount = Authors.findOne({name:author}).nRefs;  
		}
		else if (Session.get('liveFeedCategory') !== "") {
			var category = Session.get('liveFeedCategory');
			postsReactiveCount = Categories.findOne({name:category}).nRefs;  
		}
		else {
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
			serverPosts = Authors.findOne({name:author}).nRefs;
		}
		else if (Session.get('liveFeedCategory') !== "") {
			var category = Session.get('liveFeedCategory');
			serverPosts = Categories.findOne({name:category}).nRefs;
		}
		else
			serverPosts = LiveFeedCounts.findOne().count;

		var serverPostsDiff = serverPosts - Session.get('postsServerNonReactive'); // Check if there are new posts
		if (serverPostsDiff == 0 && serverPosts > Session.get('postsLimit')) // No new post & posts to load
			return true
		else if (serverPostsDiff > 0) {
			return (serverPosts - serverPostsDiff > Session.get('postsLimit')) // There are new posts, so we remove them from the count
		}
	},
	noFilter: function() { // Check if posts are filtered
		return (Session.get('liveFeedCategory') == "" && Session.get('author') == "")
	}
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
		else
			Session.set('postsServerNonReactive', LiveFeedCounts.findOne().count);

		liveFeedResetPostInterval();
	}


liveFeedResetFilters = function() {
	Session.set('author','');
	Session.set('liveFeedCategory','');
}