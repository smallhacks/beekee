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


Template.indexStudent.onCreated(function() {

	//Session.set('lang','en-US');

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
	
	Deps.autorun(function() {

		TAPi18n.setLanguage(Session.get('lang')); // Translation of app-specific texts
		T9n.setLanguage(Session.get('lang')); // Translation for basic Meteor packages (account, etc.)
		moment.locale(Session.get('lang')); // Translation for livestamp

		if (typeof Cookie.get('spacesVisited') != "undefined") { // Autorun to reactively update space visited subscription
			var spaces = JSON.parse(Cookie.get('spacesVisited'));
			Meteor.subscribe('spacesVisited', spaces);
		}
	});
});


Template.indexStudent.events({

	'change #langSelect': function(e) {
		var lang = $(e.target).val();
		Session.setPersistent('lang',lang);
	},
	'submit form#index-student--code-link-form': function(e) {
		e.preventDefault();

		var code = $(e.target).find('[id=code]').val();

		if (code && code != "") {
			Meteor.call('getSpaceId', code, function(error, result) {
				if (error) {
					alert(TAPi18n.__('error-message')+error.message);
				} else if (result != null) {
					var spaceId = result;
					var spacesVisited = [];
					var cookie = Cookie.get('spacesVisited');
					if (typeof cookie == "undefined" || cookie == "") // Check if user has already visited spaces
						spacesVisited.push(spaceId);
					else {
						spacesVisited = JSON.parse(Cookie.get('spacesVisited'));
						if (JSON.parse(Cookie.get('spacesVisited')).indexOf(spaceId) == -1)
							spacesVisited.push(spaceId);
					}
					Cookie.set('spacesVisited', JSON.stringify(spacesVisited), {expires: 30}); // Set a cookie to remember visited spaces
					Session.set(spaceId,null); // Reset Session
					Router.go('space', {_id: spaceId});
				}
				else if (result == null) {
					alert(TAPi18n.__('index-student--space-doesnt-exist-message'));
				}
			});
		}
	},
    'click .index-student--button-code-link': function(e) {
    	e.preventDefault();

    	$('#index-student--code-link-form').submit();
  	},
    'click .index-student--delete-recent': function(e) {
		e.preventDefault();

		Cookie.remove('spacesVisited');
		$('.index-student--visited-spaces').hide();
	}
});


Template.indexStudent.helpers({

	langIsSelected: function(lang) {
		if (Session.get('lang') == lang)
			return 'selected'
	},
	spacesVisited: function() {
		if (typeof Cookie.get('spacesVisited') != "undefined") {
			var spaces = JSON.parse(Cookie.get('spacesVisited'));
			return Spaces.find({'_id':{$in:spaces}});
		}
	},
	publicSpaces: function() {
		return Spaces.find({"permissions.public":true});
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
	isBox: function() {
		return (Meteor.settings.public.isBox === "true")
	}
});


