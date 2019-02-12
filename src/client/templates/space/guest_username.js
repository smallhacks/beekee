Template.guestUsername.events({
	
	'submit form': function(event, template) {
		event.preventDefault();

		var authorName = $('#authorName').val().trim();

		Meteor.call('authorInsert', authorName, template.data.space._id, function(error) {
			if(error)
				alert(TAPi18n.__('error-message')+error.message);
			else {
				Session.setPersistent(template.data.space._id, {author: authorName}); // Persistent to browser refresh
				$('#guestUsername').modal('hide');
				Router.go('space', {_id: template.data.space._id, userUsername: authorName});			
			} 
		});
	},
	'click .guest-username--button-submit': function(event, template) {
		event.preventDefault();
		$('#guest-username--form').submit();
	}
});