Template.layout.onRendered(function () {

	// Lateral menu
	var template = this;
	slideout = new Slideout({
		'panel': template.$('#content').get(0),
		'menu': template.$('#slideout-menu').get(0),
		'padding': 256,
		'tolerance': 70,
		'touch': false
	});

	function closeMenu(event) {
		event.preventDefault();
		slideout.close();
		event.stopPropagation(); // Prevent click propagation to menu wrapper button
	}

	//Close lateral menu on click
	slideout
	.on('beforeopen', function(event) {
		this.panel.classList.add('panel-open');
	})
	.on('open', function(event) {
		this.panel.addEventListener('click', closeMenu);
		this.panel.classList.add('overflow-hidden');
	})
	.on('beforeclose', function(event) {
		this.panel.classList.remove('panel-open');
		this.panel.removeEventListener('click', closeMenu);
		this.panel.classList.remove('overflow-hidden');
	});


	//Set locale
	var lang = null;
	if (Session.get('lang')) // If locale is set by user
		lang = Session.get('lang');
	else {
		// Set locale according to browser
		function getLang() {
			console.log(navigator.languages[0]);
		    return (
		        navigator.languages && navigator.languages[0] ||
		        navigator.language ||
		        navigator.browserLanguage ||
		        navigator.userLanguage ||
		        'en-US'
		    );
		}
		lang = getLang();
		Session.set('lang',lang);
	}

	Meteor.autorun(function () { 
		
		TAPi18n.setLanguage(Session.get('lang')); // Translation of app-specific texts
		T9n.setLanguage(Session.get('lang')); // Translation for basic Meteor packages (account, etc.)
		moment.locale(Session.get('lang')); // Translation for livestamp

	// Check connection status (used for box)
	    var stat;
	    if (Meteor.status().status === "connected") {
	        stat = 1;
	    }
	    else if (Meteor.status().status === "connecting") {
	        stat = 0;
	    }
	    else {
	        stat = 0;
	    }
	    Session.set('status', stat);
	});
});


Template.layout.events({
	
	'touchend input': function(e) { // Speedup focus on input for mobile devices
		$(e.target).focus();
	},
	'touchend textarea': function(e) {
		$(e.target).focus();
	},  
	'click .header--button-menu': function(e) {
		e.preventDefault();
		slideout.toggle();
	}
});


Template.layout.helpers({
	
	isAdmin: function() {
		if (Roles.userIsInRole(Meteor.userId(), ['admin']) === true)
			return true;
	},
	status: function() {
		if (!Session.get('status'))
			return 'layout--status-disconnected'
		else
			return 'layout--status-connected'
	},
	isBox: function() { // Check if Meteor is running under a beekee box
    	return (Meteor.settings.public.isBox === "true")
  },
});