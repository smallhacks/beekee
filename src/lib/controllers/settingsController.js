SettingsController = RouteController.extend({

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