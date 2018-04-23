Template.spaceUsers.events({
	
	'submit form': function(event, template) {
		event.preventDefault();

		var authorName = $('#authorName').val().trim();

		if (authorName != "") {
			if (Authors.findOne({name:authorName})) {
				if (confirm(TAPi18n.__('space-users--user-exist',authorName))) {
					Session.setPersistent(template.data.space._id, {author: authorName}); // Persistent to browser refresh
					Router.go('spacePage', {_id: template.data.space._id});
				}
				else
					return;
			}
			else {
				Meteor.call('authorInsert', authorName, template.data.space._id, function(error) {
					if(error)
						alert(TAPi18n.__('error-message')+error.message);
					else {
						Session.setPersistent(template.data.space._id, {author: authorName, favorites: []});
						Router.go('spacePage', {_id: template.data.space._id});					
					} 
				});
			}
		}
	},
	'click .space-users--button-submit-author': function(event, template) {
		event.preventDefault();
		$('#space-users--form').submit();
	},
	'click .space-users--button-select-author': function(event, template) {
		event.preventDefault();

		Session.setPersistent(this.spaceId, {author: event.currentTarget.dataset.author, favorites: []});
		Router.go('spacePage', {_id: template.data.space._id});
	}  
});


Template.spaceUsers.helpers({

	authors: function(){
		return Authors.find({},{sort: { name: 1 }});  
	},
	createUserAllowed: function() {
		return this.space.createUserAllowed;
	},
	optionIsSelected: function(authorName) {
		if (Session.get(Template.parentData().space._id))
			return authorName === Session.get(Template.parentData().space._id).author;
		else
			return null;
	}  
});