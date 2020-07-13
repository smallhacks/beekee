import { Template } from 'meteor/templating';
import { Posts } from '../../../api/posts.js';

import './resources.html';
import './resources_category_edit.js';
import './resources_category_submit.js';
import './resources_post.js';
import './resources_post_delete.js';
import './resources_post_edit.js';
import './resources_post_submit.js';


Template.resources.onRendered(function() {

	$('.modal').on('shown.bs.modal', function (e) {
		  $(this).find('[autofocus]').focus();
	});

	resourcesResetFilters();

	this.autorun(function() { // Autorun to reactively update subscription (filtering + interval of loaded posts)

		var filters = {spaceId:Session.get('spaceId'), type:"resource"};
		if (Session.get('resourcesCategory') != "") {
			filters = {spaceId:Session.get('spaceId'), type:"resource", category:Session.get('resourcesCategory')};
		}

		subscription = Meteor.subscribe('posts', filters);
	});
});



Template.resources.helpers({

	resourcesPosts: function() {
		return Posts.find({spaceId:Session.get('spaceId'), type:"resource"},{sort: {submitted: 1}});
	}
});


resourcesResetFilters = function() {
	Session.set('resourcesCategory','');
}