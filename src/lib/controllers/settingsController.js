SettingsController = RouteController.extend({

	onBeforeAction: function () {
		if (!Session.get(this.params._id)) {
			Router.go('firstConnection', {_id: this.params._id});
		}
		
		this.next();
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