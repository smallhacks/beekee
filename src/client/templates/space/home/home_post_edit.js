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


Template.homePostEdit.events({

	'submit form': function(e, template) {
		 e.preventDefault();

		var currentPostId = Session.get('postToEdit');
		var currentPost = Posts.findOne(currentPostId);

		var set = {};
		var title = $(e.target).find('[name=title]').val();
		if (title != currentPost.title) // If body has changed, replace by new one
			_.extend(set, {title: title});

		var body = tinymce.activeEditor.getContent();
		if (body != currentPost.body) // If body has changed, replace by new one
			_.extend(set, {body: body});

		Posts.update(currentPostId, {$set: set}, function(error) {
			if (error) {
				alert(TAPi18n.__('error-message')+error.message);
			} else {
				$('#homePostEdit').modal('hide');
			}
		});
	},
	'click .home-post-edit--button-submit': function(e) {
		e.preventDefault();

		$('#home-post-edit--form').submit();
	}
});


Template.homePostEdit.helpers({

	post: function() {
		var postId = Session.get('postToEdit');
		return Posts.findOne(postId);
	}
});