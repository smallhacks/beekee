Template.indexTeacher.onCreated(function() {

	Session.set('lang','en-US');
	TAPi18n.setLanguage(Session.get('lang')); // Translation of app-specific texts
	T9n.setLanguage(Session.get('lang')); // Translation for basic Meteor packages (account, etc.)
	moment.locale(Session.get('lang')); // Translation for livestamp

	Deps.autorun(function() { // Autorun to reactively update space visited subscription
		if (typeof Cookie.get('spacesVisited') != "undefined") {
			var spaces = JSON.parse(Cookie.get('spacesVisited'));
			Meteor.subscribe('spacesVisited', spaces);
		}
	});
});


Template.indexTeacher.onRendered(function () {

	$('.modal').on('shown.bs.modal', function (e) {
		  $(this).find('[autofocus]').focus();
	});
	
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
	publicSpaces: function() {
		return Spaces.find({permissions:{public:true}});
	},
  	isLangSelected: function(lang) {
  		if (Session.get('lang')) {
	  		langSelected = Session.get('lang');
	  		langSelected = langSelected.split("-");
			langSelected = langSelected[0]; // Remove country code
			if (lang == langSelected)
	  			return 'selected';
	  		}
	}
});