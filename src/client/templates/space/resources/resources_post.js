// Copyright 2016-2020 UNIVERSITY OF GENEVA (GENEVA, SWITZERLAND)

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