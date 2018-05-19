IndexStudentController = RouteController.extend({

	waitOn: function() {
		//Meteor.subscribe('ownSpaces', Meteor.userId())
	},
	
	action: function () {
		this.render('indexHeader', {to: 'layout--header'});
		this.render();
	},
	
	fastRender: true
});