Template.admin.events({
	
	'click .admin--change-password': function(e) {
		e.preventDefault();

		var newPassword = prompt(TAPi18n.__('admin--change-password-message')); // need to be a modal for hiding password
		if (newPassword) {
			Meteor.call('adminSetNewPassword', Meteor.user(), $(e.currentTarget).data('userid'), newPassword, function(error) {
				if (error)
					alert(TAPi18n.__('error-message')+error.message);
				else
					alert(TAPi18n.__('admin--change-password-confirm-message'));
			});
		}
	}
});


Template.admin.helpers({

	spaces: function() {
		return Spaces.find({},{sort: {submitted: -1}});
	},
	user: function() {
		return Meteor.users.find({},{sort: {createdAt: -1}});
	},
	isOnline: function() {
		if (this.status.online)
			return true
	},
	userCreatedAt: function() {
		return moment(this.createdAt).format("DD/MM/YYYY HH:mm");
	}
});