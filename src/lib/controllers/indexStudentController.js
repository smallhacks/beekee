IndexStudentController = RouteController.extend({
	
	onBeforeAction: function () {
		if (Roles.userIsInRole(Meteor.user(), 'admin')) {
			Router.go('admin');
		}
		this.next();
	},

	waitOn: function() {
	},
	
	action: function () {
		this.render();
	},
	
	fastRender: true
});