// Copyright 2016-2021 VINCENT WIDMER

// This file is part of Beekee Live.
    
// Beekee Live is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Beekee Live is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
//  along with Beekee Live.  If not, see <https://www.gnu.org/licenses/>.

//**************************************************************************


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
			Meteor.logout(function(err) {
				Router.go('indexStudent');
			});
		}
	}
});