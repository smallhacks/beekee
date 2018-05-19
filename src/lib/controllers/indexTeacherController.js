IndexTeacherController = RouteController.extend({

	waitOn: function() {
		Meteor.subscribe('ownSpaces', Meteor.userId())
	},
	
	action: function () {
		this.render('teacherHeader', {to: 'layout--header'});
		this.render();
	},
	
	fastRender: true
});