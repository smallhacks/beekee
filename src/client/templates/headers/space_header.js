Template.spaceHeader.events({

	'click .menu-item': function(e) {
		e.preventDefault();
		var menuItemId = $(e.currentTarget).attr("data-id");
		Session.set('menuItem',menuItemId);
	}
	// 'click #sidebarCollapse': function(e) {
 //        $('#sidebar').toggleClass('active');
	// }
});

Template.spaceHeader.helpers({
	
	authorName: function() {
		if (Session.get(this.space._id).author)
		return Session.get(this.space._id).author; 
	},
	adminName: function() {
		return Meteor.user().profile.name;
	},
	ownSpace: function() {
		var userId = Meteor.userId();
		var isAdmin = Roles.userIsInRole(Meteor.userId(), ['admin'])
		if (userId)
			if (this.space.userId === userId)
				return true;
		else if (isAdmin)
			if (isAdmin === true)
				return true;
		else
			return false;
	}
});