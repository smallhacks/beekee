Template.header.events({

	'click .beekee-header--change-author': function(e) {
		e.preventDefault();
		$('#guestUsername').modal('show');
	}
});

Template.header.helpers({

	courseId: function() {
		return this.space._id;
	},
	user: function() {
		return Template.parentData(1).user;
	},
	admin: function() {
		return Template.parentData(1).isAdmin;
	},
	adminCode: function() {
		return 'oSXfn6qej4bAwYpWn';
	},
	authorName: function() {
		if (Session.get(this.space._id))
		return Session.get(this.space._id).author; 
	}
});