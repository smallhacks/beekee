import { Template } from 'meteor/templating';


import './access_denied.html';

Template.accessDenied.onRendered(function () {
	
	Session.set('errorMessage', ''); // hide error messages

	this.$('.login--input-username').focus();

	// T9n.map(
	// 	'fr', { // Localization mapping
	// 		'User not found': TAPi18n.__('login--user-not-found'),
	// 		'Incorrect password': TAPi18n.__('login--incorrect-password')
	// 	},
	// 	'en', {
	// 		'User not found': TAPi18n.__('login--user-not-found'),
	// 		'Incorrect password': TAPi18n.__('login--incorrect-password')			
	// 	},
	// 	'es', {
	// 		'User not found': TAPi18n.__('login--user-not-found'),
	// 		'Incorrect password': TAPi18n.__('login--incorrect-password')			
	// 	},
	// 	'de', {
	// 		'User not found': TAPi18n.__('login--user-not-found'),
	// 		'Incorrect password': TAPi18n.__('login--incorrect-password')			
	// 	}
	// );
});


Template.accessDenied.events({
	
	'submit form': function(e) {

		e.preventDefault();
		Session.set('errorMessage', ''); // hide error messages
		var email = e.target.email.value;
		var password = e.target.password.value;

		if (email && password) {
			Meteor.loginWithPassword(email.trim(), password, function(err) {
				if(!err)
					this.next();
				else    
					Session.set('errorMessage', err.reason);
			});
		}
	},
	'click .login--button-submit': function(e) {
		e.preventDefault();
		$('#login--form').submit();
		console.log("on envoie");
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


Template.accessDenied.helpers({

	errorMessage: function() {
		return Session.get('errorMessage');
	},
	passwordRecovery: function() {
		if (Session.get('errorMessage') === 'Incorrect password')
			return true;
	}
});