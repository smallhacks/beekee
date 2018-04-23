SpaceListController = RouteController.extend({

	waitOn: function() {
		Meteor.subscribe('ownSpaces', Meteor.userId())
	},
	
	action: function () {
		this.render('spacesHeader', {to: 'layout--header'});
		this.render();
	},
	
	fastRender: true
});