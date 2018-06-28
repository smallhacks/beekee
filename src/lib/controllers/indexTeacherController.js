IndexTeacherController = RouteController.extend({

	onBeforeAction: function () {
		if (!Meteor.userId()) {
			Router.go('login');
		}
		this.next();
	},

	waitOn: function() {
		Meteor.subscribe('ownSpaces', Meteor.userId())
	},
	
	action: function () {
		this.render('teacherHeader', {to: 'layout--header'});
		this.render();
	},
	
	fastRender: true
});