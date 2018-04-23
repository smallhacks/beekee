Template.spaceList.onCreated(function() {

	Deps.autorun(function() { // Autorun to reactively update space visited subscription
		if (typeof Cookie.get('spacesVisited') != "undefined") {
			var spaces = JSON.parse(Cookie.get('spacesVisited'));
			Meteor.subscribe('spacesVisited', spaces);
		}
	});
});


Template.spaceList.events({

	'submit form.space-list--code-link-form': function(e) {
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
					alert(TAPi18n.__('space-list--space-doesnt-exist-message'));
				}
			});
		}
	},
    'click .space-list--button-code-link': function(e) {
    	e.preventDefault();

    	$('.space-list--code-link-form').submit();
  	},
    'click .space-list--delete-recent': function(e) {
		e.preventDefault();

		Cookie.remove('spacesVisited');
		$('.space-list--visited-spaces').hide();
	},
	'click .space-list--select-lang': function(e) {
		e.preventDefault();

		Session.setPersistent('lang',$(e.currentTarget).data('lang'));
	},
	'click .space-list--shutdown': function(e, template) {
		e.preventDefault();

		var alert = confirm(TAPi18n.__('space-list--shutdown-message'));
		if (alert) {
			Meteor.call('shutdownBox', function(error, result){
				if (error) {
					alert(TAPi18n.__('error-message')+error.message);
				}
				else {
					alert(TAPi18n.__('space-list--shutdown-confirm'));
				}
			});
		}
	}  
});


Template.spaceList.helpers({
	
	ownSpaces: function() {
		return Spaces.find({userId:Meteor.userId()}, {sort: {submitted: -1}});
	},
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


