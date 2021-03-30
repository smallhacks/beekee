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