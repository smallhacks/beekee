AdminController = RouteController.extend({

	waitOn: function () {
		return [
				Meteor.subscribe('allSpaces'),
				Meteor.subscribe('allUsers')
			];
	},

	action: function () {
		this.render('header', {to: 'layout--header'});
		this.render();
	},
	
	fastRender: true
});