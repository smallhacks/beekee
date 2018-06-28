LiveFeedController = RouteController.extend({

	onBeforeAction: function () {
		if (!Session.get(this.params._id)) {
			Router.go('firstConnection', {_id: this.params._id});
		}
		
		this.next();
	},

	waitOn: function () { 
		return [
			Meteor.subscribe('liveFeedPosts', this.params._id),
			Meteor.subscribe('files', this.params._id),
			Meteor.subscribe("count-all-posts", this.params._id),
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
		this.render('spaceHeader', {to: 'layout--header'});
		this.render();
	},

	fastRender: true
});