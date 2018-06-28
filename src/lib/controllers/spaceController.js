SpaceController = RouteController.extend({

	onBeforeAction: function () {
		var spaceId = this.params._id;
		if (!Session.get(spaceId)) {
			if (Meteor.userId()) {
				var adminName = Meteor.user().profile.name;
				Meteor.call('authorInsert', adminName, spaceId, function(error) {
					if (error) {
						console.log(error);
					}
					else {
						Session.setPersistent(spaceId, {author: adminName}); // Persistent to browser refresh
					}
				});
			} else
				Router.go('spaceUsersFirstConnection', {_id: spaceId});
		}
		
		this.next();
	},

	waitOn: function () { 
		return [
			//Meteor.subscribe('homePosts', this.params._id),
			//Meteor.subscribe('posts', this.params._id),

			Meteor.subscribe("count-all-live-feed", this.params._id),
			// Meteor.subscribe('files', this.params._id),
			//Meteor.subscribe('allFiles'),

			//Meteor.subscribe("count-all-posts", this.params._id),
			Meteor.subscribe("count-all-pinned", this.params._id),
			Meteor.subscribe("count-all-files", this.params._id),
			Meteor.subscribe("count-all-images", this.params._id),
			Meteor.subscribe('space', this.params._id),
			Meteor.subscribe('authors', this.params._id),
			Meteor.subscribe('categories', this.params._id)  
		];
	},

	data: function () {
		return {
			space: Spaces.findOne(this.params._id),
			posts: Posts.find({spaceId:this.params._id}),
			last: this.params.last
		}
	},

	action: function () {
		this.render();
	},

	fastRender: true
});