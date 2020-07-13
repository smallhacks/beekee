import { Template } from 'meteor/templating';
import { Posts } from '../../../api/posts.js';

import './resources_post.html';


Template.resourcesPost.onCreated(function() {
	imageExtensions = ["jpg","jpeg","png","gif"];
});


Template.resourcesPost.onRendered(function() {

	//$('.post-item--add-comment-textarea').autosize(); // Textarea autosize

	$('#resourcesPostEdit').on('hide.bs.modal', function (e) {
		Session.set('fileId', false);
		Session.set('fileName', false);
		Session.set('fileExt', false);
		Session.set('filePath', false);
	})
});


Template.resourcesPost.events({

	'click .resources-post--edit': function(e) {
		e.preventDefault();
		
		var postId = this._id;
		Session.set('postToEdit',postId);
		//Session.set('fileId', false);
		if (Posts.findOne(postId).fileId) {// If image already exist, set fileId + fileExt in session
			Session.set('fileId', Posts.findOne(postId).fileId);
			Session.set('fileName', Posts.findOne(postId).fileName);
			Session.set('fileExt', Posts.findOne(postId).fileExt);
			Session.set('filePath', Posts.findOne(postId).filePath);
		}
		$('#resourcesPostEdit').modal({show:true,backdrop:'static'});

	},
	'click .resources-post--delete': function(e) {
		e.preventDefault();
		
		var postId = this._id;
		Session.set('postToDelete',postId);
		$('#resourcesPostDelete').modal('show');
	}
});

Template.resourcesPost.helpers({

	image: function() {
		if (this.fileId && $.inArray(this.fileExt, imageExtensions) != -1)
			return this.fileId
	},
	filePath: function() {
		return encodeURI(this.filePath);
	}
});