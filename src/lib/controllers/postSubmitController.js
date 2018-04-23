PostSubmitController = RouteController.extend({

	onBeforeAction: function () {
		if (!Session.get(this.params._id))  {
			// If the user has not a spaceId session, render the spaceUsers template
			this.render('spaceEditHeader', {to: 'layout--header'});
			this.render('spaceUsers', {to: 'layout--main'});
		} else {
			this.next();
		}
	},

	waitOn: function () {
		return [
			Meteor.subscribe('tags', this.params._id),
			Meteor.subscribe('authors', this.params._id),
			Meteor.subscribe('categories', this.params._id),
			Meteor.subscribe('space', this.params._id),
		];
	},

	data: function () {    
		return {
			space: Spaces.findOne(this.params._id)
		}
	},

	action: function () {
		this.render('postSubmitHeader', {to: 'layout--header'});
		this.render();
	},
	
	fastRender: true
});