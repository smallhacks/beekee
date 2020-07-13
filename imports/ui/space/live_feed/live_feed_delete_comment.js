import { Template } from 'meteor/templating';

import './live_feed_delete_comment.html';


Template.liveFeedDeleteComment.events({

	'click .live-feed--delete-comment--confirm': function(e) {
		e.preventDefault();

		var currentPostId = Template.parentData(1)._id;
		var currentCommentId = this.id;
		
		Posts.update(currentPostId, {$pull: {comments: {id:currentCommentId}}}, function(error) {
			if (error) {
				alert(TAPi18n.__('error-message')+error.message);
			} else {		
				$('#liveFeedDeleteComment-'+currentCommentId).modal('hide');
			}
		});
	}
});
