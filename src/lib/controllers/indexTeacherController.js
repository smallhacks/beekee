IndexTeacherController = RouteController.extend({

	onBeforeAction: function () {
		if (!Meteor.userId()) {
			Router.go('login');
		}
		else if (Roles.userIsInRole(Meteor.user(), 'admin')) {
			Router.go('admin');
		}
		this.next();
	},

	waitOn: function() {
		Meteor.subscribe('ownSpaces', Meteor.userId())
	},
	
	action: function () {
		this.render();
	},
	
	fastRender: true
});