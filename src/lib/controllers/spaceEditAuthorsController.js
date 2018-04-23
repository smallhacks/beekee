SpaceEditAuthorsController = RouteController.extend({

	waitOn: function () {
		return [
			Meteor.subscribe('authors', this.params._id),
			Meteor.subscribe('categories', this.params._id),
			Meteor.subscribe('space', this.params._id),
		]
	},

	data: function () {
		return { 
			space: Spaces.findOne(this.params._id),
		}
	},

	action: function () {
		this.render('headerBackButton', {to: 'layout--header'});
		this.render();
	},
	
	fastRender: true
});