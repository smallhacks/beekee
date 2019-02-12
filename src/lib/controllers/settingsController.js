SettingsController = RouteController.extend({

	onBeforeAction: function () {

		if (this.params.isadmin == "oSXfn6qej4bAwYpWn") {
			this.next();
		}
		else {
			this.render('spacesHeader', {to: 'layout--header'});
			this.render('accessDenied');
		}		
	},

	waitOn: function () { 
		return [
			Meteor.subscribe('space', this.params._id),
		];
	},

	data: function () {
		return {
			space: Spaces.findOne(this.params._id)		}
	},

	action: function () {
		this.render();
	},

	fastRender: true
});