Template.postsHeader.onRendered(function() {

	$('.open-popup-link').magnificPopup({
	  type:'inline',
	  closeOnContentClick: false,
	  closeOnBgClick: false,
	  midClick: true, // Allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source in href.
	  callbacks: {
    		open: function() {
      // Will fire when this exact popup is opened
      // this - is Magnific Popup object
    		},
    		close: function() {

	    		// Reset form	
	    		$(".post-submit--textarea").val('');
	    		$(".post-submit--select-categories").val('');

				if (Session.get("fileId")) {
					delete Session.keys["fileId"]; // Clear fileId session
				    Session.set("fileId",false);
				}

				if (Session.get("fileExt")) {
					delete Session.keys["fileExt"]; // Clear fileExt session
				    Session.set("fileExt",false);
	    		}

			}
    	}
	});
});

Template.postsHeader.events({
	
	'click .header--logo': function(e) {
		e.preventDefault();
		resetFilters();
		Session.set('postsServerNonReactive', Counts.findOne().count);
		resetPostInterval();
  	},
  	'click .header--exit-button': function(e) {
		e.preventDefault();
		if (confirm(TAPi18n.__('header--exit-message'))) {
			if (Meteor.user())
				Router.go('indexTeacher');
			else
				Router.go('indexStudent');
		}
  	}
});

Template.postsHeader.helpers({
	
	authorName: function() {
		if (Session.get(this.space._id).author)
		return Session.get(this.space._id).author; 
	},    
	submitAllowed: function() {
		if (this.space.postEditPermissions !== undefined) {
			if (this.space.postEditPermissions === "none" && Roles.userIsInRole(Meteor.userId(), ['admin']) != true && this.space.userId != Meteor.userId())
				return false
			else
				return true
		}
		else 
			return true
	},
	ownSpace: function() {
		var userId = Meteor.userId();
		var isAdmin = Roles.userIsInRole(Meteor.userId(), ['admin'])
		if (userId)
			if (this.space.userId === userId)
				return true;
		else if (isAdmin)
			if (isAdmin === true)
				return true;
		else
			return false;
	}
});