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


Template.homePost.events({

	'click .home-post--order-up': function(e) {
		e.preventDefault();
		
		var post = this;

		if (this.order > 0) { // Check if post is not the first
			var postUpOrder = Posts.findOne({type:"home",order:this.order-1});

			Posts.update({_id:postUpOrder._id},{$set:{order:post.order}},function(err) {
				if (!err) {
					Posts.update({_id:post._id},{$set: {order:post.order-1}});
				}
			});
		}
	},
	'click .home-post--order-down': function(e) {
		e.preventDefault();

		var maxOrder = Posts.find({type:"home"},{sort:{order:-1},limit:1}).fetch();

		if (this.order < maxOrder[0].order) { // Check if post is not the last
			var post = this;
			var postDownOrder = Posts.findOne({type:"home",order:this.order+1});

			Posts.update({_id:postDownOrder._id},{$set:{order:post.order}},function(err) {
				if (!err) {
					Posts.update({_id:post._id},{$set: {order:post.order+1}});
				}
			});
		}
	},
	'click .home-post--edit': function(e) {
		e.preventDefault();
		
		var postId = this._id;
		Session.set('postToEdit',postId);
		Session.set('fileId', false);

		if (Posts.findOne(postId).fileId) {// If image already exist, set fileId + fileExt in session
			Session.set('fileId', Posts.findOne(postId).fileId);
			Session.set('fileExt', Posts.findOne(postId).fileExt);
		}

		$('#homePostEdit').modal('show');

		$('#homePostEdit').on('shown.bs.modal', function (e) {
			tinymce.init({
			  	selector: 'textarea#body-edit-tinymce',
			  	skin_url: '/packages/teamon_tinymce/skins/lightgray',
		  		paste_data_images: true
			});
		});

		$('#homePostEdit').on('hidden.bs.modal', function (e) {
			tinymce.remove( "textarea#body-edit-tinymce" );
		});

	},
	'click .home-post--delete': function(e) {
		e.preventDefault();
		
		var postId = this._id;
		Session.set('postToDelete',postId);
		$('#homePostDelete').modal('show');
	}
});