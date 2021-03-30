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


Template.lessonsPostSubmit.onCreated(function() {

		if (Session.get("fileId"))
			delete Session.keys["fileId"]; // Clear fileId session

		if (Session.get("fileExt"))
			delete Session.keys["fileExt"]; // Clear fileExt session

	imageExtensions = ["jpg","jpeg","png","gif"];

	toastr.options = {
	  	"positionClass": "toast-bottom-center",
	}
});


Template.lessonsPostSubmit.onRendered(function() {

	$('.lessons-post-submit--textarea').autosize(); // Set textarea height automatically according to text size

	Deps.autorun(function() { // Autorun to reactively update subscription of file
		if (Session.get("fileId"))
			Meteor.subscribe('file', Session.get("fileId"));
	});

	Uploader.finished = function(index, fileInfo, templateContext) { // Triggered when file upload is finished
	// TODO : don't upload file before submit post (or remove after if post isn't submitted)	

		Session.set("fileId",fileInfo.fileId);
		Session.set("fileName",fileInfo.fileName);
		Session.set("fileExt",fileInfo.fileExt);
		Session.set("filePath",fileInfo.path);
	}

	// Set default author if not defined
	if (Template.parentData(2))
		if (!Session.get(Template.parentData(2).space._id))
			Session.set(Template.parentData(2).space._id, {author: 'Invité'});

	$(".lessons-post-submit--form").validate({
        rules: {
            title: {
                required: true
            }
        }
    }); 
});


Template.lessonsPostSubmit.events({

	'submit form': function(e, template) {
		 e.preventDefault();

		var author = Session.get(this.space._id).author;  
		var body = $(e.target).find('[name=body]').val();
		var title = $(e.target).find('[name=title]').val();
		var spaceId = template.data.space._id;
		var fileId = Session.get("fileId");
		var fileName = Session.get("fileName");
		var fileExt = Session.get("fileExt");

		//var tags = $(e.target).find('[name=tags]').val().toLowerCase().replace(/ /g,'').split(',');
		var category = $(e.target).find('[name=category]').val();

		// TODO : check how imagesToDelete work
		// var imagesToDelete = Session.get('imagesToDelete');
		// imagesToDelete.forEach(function(imageId) {
		// 		Images.remove(imageId);
		// });

		Meteor.call('postInsert', {author: author, body: body, title: title, spaceId: spaceId, type: "lesson", fileId: fileId, fileName:fileName, fileExt: fileExt, category: category}, function(error, postId) {
			if (error){
				alert(TAPi18n.__('error-message')+error.message);
			} else {
				$(e.target).find('[name=body]').val('');
				$(e.target).find('[name=title]').val('');
				$(e.target).find('[name=categorySelect]').val('');

				Session.set("fileId",null); // Clear fileId session
				Session.set("fileName",null); // Clear fileId session
				Session.set("fileExt",null); // Clear fileId session
				Session.set("filePath",null); // Clear fileId session

				delete Session.keys["fileId"]; // Clear fileId session
				delete Session.keys["fileName"]; // Clear fileId session
				delete Session.keys["fileExt"]; // Clear fileId session
				delete Session.keys["filePath"]; // Clear fileExt session

				$('.lessons-post-submit--button-submit').prop('disabled', true);
				$('#lessonsPostSubmit').modal('hide');
				toastr.success("",TAPi18n.__('lessons-post-submit--confirm-toast'));
			};
		});
	},
	'click .lessons-post-submit--retry': function(e) {
		e.preventDefault();
		Session.set("fileId",null); // Clear fileId session
		Session.set("fileName",null); // Clear fileId session
		Session.set("fileExt",null); // Clear fileId session
		Session.set("filePath",null); // Clear fileId session
		$('.lessons-post-submit--button-submit').prop('disabled', false);
	},
	'click .lessons-post-submit--button-submit': function(e) {
		e.preventDefault();
		$('#lessons-post-submit--form').submit();
	},
	'click .post-submit--button-delete-image': function(e) {
		e.preventDefault();
		if (confirm(TAPi18n.__('post-submit--confirm-delete-image'))) {
			Session.set('fileId', false);
		}  
		$('.lessons-post-submit--button-submit').prop('disabled', true);
	},
	'click .post-submit--button-delete-file': function(e) {
		e.preventDefault();
		if (confirm(TAPi18n.__('post-submit--confirm-delete-file'))) {
			Session.set('fileId', false);
		}  
		$('.lessons-post-submit--button-submit').prop('disabled', true);
	}
});


Template.lessonsPostSubmit.helpers({

	// image: function() {
	// 	if (Session.get("fileId") && $.inArray(Session.get("fileExt"), imageExtensions) != -1 ) {
	// 		var fileId = Session.get("fileId");
	// 		var fileInCollection = Files.findOne({fileId:fileId});

	// 		if (fileInCollection) // Wait until file is in Files collection
	// 			$(".post-submit--button-submit").show();
	// 		return fileInCollection;
	// 	}
	// 	else
	// 		return false;
	// },
	lessonUploaded: function() {
		if (Session.get("fileId")) {
			var fileId = Session.get("fileId");

			// Wait until file is in Files collection
			var fileInCollection = Files.findOne({_id:fileId});
			if (fileInCollection && !fileInCollection.error) {
				$('.lessons-post-submit--button-submit').prop('disabled', false);
			}
			return fileInCollection;
		}
		else
			return false;
	},
	file: function() {
		if (Session.get("fileExt") && $.inArray(Session.get("fileExt"), imageExtensions) == -1 )
			return true;
	},
	image: function() {
		if (Session.get("fileExt") && $.inArray(Session.get("fileExt"), imageExtensions) != -1 )
			return Session.get("fileId");
	},
	categories: function() {
		return Categories.find({spaceId: this.space._id},{sort: { name: 1 }});  
	},
	userId: function() {
		return Meteor.user();
	},
	formData: function() {
    	return {
     		spaceId: this.space._id,
      		type: "lesson"
    	}
  	}
});