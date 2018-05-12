Template.indexStudent.onCreated(function() {

	Deps.autorun(function() { // Autorun to reactively update space visited subscription
		if (typeof Cookie.get('spacesVisited') != "undefined") {
			var spaces = JSON.parse(Cookie.get('spacesVisited'));
			Meteor.subscribe('spacesVisited', spaces);
		}
	});
});


Template.indexStudent.events({

	'submit form.index-student--code-link-form': function(e) {
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
					Router.go('spacePage', {_id: spaceId});
				}
				else if (result == null) {
					alert(TAPi18n.__('index-student--space-doesnt-exist-message'));
				}
			});
		}
	},
    'click .index-student--button-code-link': function(e) {
    	e.preventDefault();

    	$('.index-student--code-link-form').submit();
  	},
    'click .index-student--delete-recent': function(e) {
		e.preventDefault();

		Cookie.remove('spacesVisited');
		$('.index-teacher--visited-spaces').hide();
	},
	'click .index--select-lang': function(e) {
		e.preventDefault();

		Session.setPersistent('lang',$(e.currentTarget).data('lang'));
	}
});


Template.indexStudent.helpers({
	
	spacesVisited: function() {
		if (typeof Cookie.get('spacesVisited') != "undefined") {
			var spaces = JSON.parse(Cookie.get('spacesVisited'));
			return Spaces.find({'_id':{$in:spaces}});
		}
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
	  	}
});


