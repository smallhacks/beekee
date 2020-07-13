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
		console.log("waith on... : "+Meteor.userId());
		Meteor.subscribe('ownSpaces', Meteor.userId());
		Meteor.subscribe('publicSpaces');
	},
	
	action: function () {
		this.render();
	},
	
	fastRender: true
});