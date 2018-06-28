Template.userSettings.events({

	'click .user-settings--change-password': function(e) { // Change user password
		e.preventDefault();

		var oldPassword = prompt(TAPi18n.__('user-settings--change-password-old-message'));
		if (oldPassword) 
			var newPassword = prompt(TAPi18n.__('user-settings--change-password-new-message'));
		if (newPassword) {
			Accounts.changePassword(oldPassword, newPassword, function(error) {
				if (error)
					alert(TAPi18n.__('error-message')+error.message);
				else
					alert(TAPi18n.__('user-settings--change-password-confirm-message'));
			});
		}
	},
	'click .user-settings--logout': function(e) {
		e.preventDefault();

		if (confirm(TAPi18n.__('user-settings--confirm-logout'))) {
			Meteor.logout(); 
			Router.go('indexStudent');
		}
	}
});