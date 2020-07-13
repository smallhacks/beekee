import { Template } from 'meteor/templating';
import { Authors } from '../../api/authors.js';

import './space_users_first_connection.html';
import '../headers/users_header.html';


Template.spaceUsersFirstConnection.onRendered(function () {

    // Enable autofocus
	$('#space-users-first-connection--author-name').focus();
});


Template.spaceUsersFirstConnection.events({
	
	'submit form': function(event, template) {
		event.preventDefault();

		var authorName = $('#space-users-first-connection--author-name').val().trim();

		if (authorName != "") {
			if (Authors.findOne({name:authorName})) {
				if (confirm(TAPi18n.__('space-users--user-exist',authorName))) {
					Session.setPersistent(template.data.space._id, {author: authorName}); // Persistent to browser refresh
					Router.go('space', {_id: template.data.space._id});
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
						Router.go('space', {_id: template.data.space._id});					
					} 
				});
			}
		}
	},
	'click .space-users--button-submit-author': function(event, template) {
		event.preventDefault();
		$('#space-users--form').submit();
	}
});