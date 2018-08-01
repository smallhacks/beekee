IndexStudentController = RouteController.extend({
	
	onBeforeAction: function () {
		if (Roles.userIsInRole(Meteor.user(), 'admin')) {
			Router.go('admin');
		}
		this.next();
	},

	waitOn: function() {
		Meteor.subscribe('publicSpaces')
	},
	
	action: function () {
		this.render();
	},
	
	fastRender: true
});