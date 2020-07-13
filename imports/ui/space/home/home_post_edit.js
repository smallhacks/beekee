import { Template } from 'meteor/templating';

import { Posts } from '../../../api/posts.js';

import './home_post_edit.html';


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