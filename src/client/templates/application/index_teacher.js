Template.indexTeacher.onCreated(function() {

	Deps.autorun(function() { // Autorun to reactively update space visited subscription
		if (typeof Cookie.get('spacesVisited') != "undefined") {
			var spaces = JSON.parse(Cookie.get('spacesVisited'));
			Meteor.subscribe('spacesVisited', spaces);
		}
	});
});


Template.indexTeacher.onRendered(function () {
	
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


Template.indexTeacher.events({

	'click .index--select-lang': function(e) {
		e.preventDefault();

		Session.setPersistent('lang',$(e.currentTarget).data('lang'));
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
	},
	'click .index-teacher--shutdown': function(e, template) {
		e.preventDefault();

		var alert = confirm(TAPi18n.__('index-teacher--shutdown-message'));
		if (alert) {
			Meteor.call('shutdownBox', function(error, result){
				if (error) {
					alert(TAPi18n.__('error-message')+error.message);
				}
				else {
					alert(TAPi18n.__('index-teacher--shutdown-confirm'));
				}
			});
		}
	} 
});


Template.indexTeacher.helpers({
	
	ownSpaces: function() {
		return Spaces.find({userId:Meteor.userId()}, {sort: {submitted: -1}});
	},
	isBox: function() {
    	return (Meteor.settings.public.isBox === "true")
  	},
  	isLangSelected: function(lang) {
  		if (Session.get('lang')) {
	  		langSelected = Session.get('lang');
	  		langSelected = langSelected.split("-");
			langSelected = langSelected[0]; // Remove country code
			if (lang == langSelected)
	  			return 'selected';
	  		}
	},
	errorMessage: function() {
		return Session.get('errorMessage');
	},
	passwordRecovery: function() {
		if (Session.get('errorMessage') === 'Incorrect password')
			return true;
	}
});