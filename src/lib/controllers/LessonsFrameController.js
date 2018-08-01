LessonsFrameController = RouteController.extend({

	waitOn: function () { 
		return [
	  		Meteor.subscribe('post', this.params._id)
		];
	},

	data: function () {
		return {
			post: Posts.findOne(this.params._id)		
		}
	},

	action: function () {
		this.render();
	},

	fastRender: true
});