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


Template.login.onRendered(function () {
	
	Session.set('errorMessage', ''); // hide error messages

	this.$('.login--input-username').focus();

	T9n.map(
		'fr', { // Localization mapping
			'User not found': TAPi18n.__('login--user-not-found'),
			'Incorrect password': TAPi18n.__('login--incorrect-password')
		},
		'en', {
			'User not found': TAPi18n.__('login--user-not-found'),
			'Incorrect password': TAPi18n.__('login--incorrect-password')			
		},
		'es', {
			'User not found': TAPi18n.__('login--user-not-found'),
			'Incorrect password': TAPi18n.__('login--incorrect-password')			
		},
		'de', {
			'User not found': TAPi18n.__('login--user-not-found'),
			'Incorrect password': TAPi18n.__('login--incorrect-password')			
		}
	);
});


Template.login.events({

	'keypress input': function(event) {
	    if (event.keyCode == 13) {
			$('#login--form').submit();
	    }
	},
	'submit form': function(e) {
		e.preventDefault();
		Session.set('errorMessage', ''); // hide error messages
		var email = e.target.email.value;
		var password = e.target.password.value;

		if (email && password) {
			Meteor.loginWithPassword(email.trim(), password, function(err) {
				if(!err)
					Router.go('indexTeacher');
				else    
					Session.set('errorMessage', err.reason);
			});
		}
	},
	'click .login--button-submit': function(e) {
		e.preventDefault();
		$('#login--form').submit();
	},
	'click .login--send-mail-forgot-password': function(e) {
		e.preventDefault();
		var email = $('#email').val();
		Accounts.forgotPassword({email:email},function(err) {
			if(!err)
				alert(TAPi18n.__("login--send-mail-forgot-password",email));    
			else {
				alert(TAPi18n.__("login--send-mail-forgot-password-error"));
				console.log(TAPi18n.__("login--send-mail-forgot-password-error-log",err));
			}
		});
	}
});


Template.login.helpers({

	errorMessage: function() {
		return Session.get('errorMessage');
	},
	passwordRecovery: function() {
		if (Session.get('errorMessage') === 'Incorrect password')
			return true;
	}
});