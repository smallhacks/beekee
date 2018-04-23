
Template.spaceEditAuthors.events({

	'click .space-edit-authors--button-delete-author': function(event, template) {
		var currentSpaceId = template.data.space._id;
		var authorName = $(event.target).data("delete-author");
		var author = Authors.findOne({name: authorName, spaceId: currentSpaceId});
		if(confirm(TAPi18n.__('space-edit-authors--delete-author-message',authorName)))
			Authors.remove(author._id, function(error) {
				if (error)
					alert(TAPi18n.__('error-message')+error.message);
		});
	},
	'click .space-edit-authors--button-edit-author': function(event, template) {
		var currentSpaceId = template.data.space._id;
		var oldName = $(event.target).data("edit-author");
		var newName = prompt(TAPi18n.__('space-edit-authors--edit-author-message'),oldName);
		Meteor.call('authorEdit', currentSpaceId, oldName, newName, function(error) {
			if (error)
					alert(TAPi18n.__('error-message')+error.message);
		});
	},
	'submit form.space-edit--form-add-author': function(e) {
		e.preventDefault();
		var currentSpaceId = this.space._id;
		var authorName = $('#authorName').val().trim();
		if (authorName != "")
		{
			if (Authors.findOne({spaceId: this.space._id, name:authorName}))
				alert(TAPi18n.__('space-edit-authors--add-author-error-message'));
			else {
				Meteor.call('authorInsert', authorName, this.space._id, function(error) {
					if (error)
					alert(TAPi18n.__('error-message')+error.message);
				});
				$('#authorName').val('');
				$('*[data-author="'+authorName+'"]').css("background-color", "#77b3d4");  // Animation when add a category
				setTimeout(function(){  $('*[data-author="'+authorName+'"]').css("background-color", "");}, 1000);
			}
		}
	}
});


Template.spaceEditAuthors.helpers({
	
	authors: function(){
		return Authors.find({spaceId: this.space._id},{sort: { name: 1 }});  
	},
	guest: function(){ // Guest cannot be deleted
		return this.name === 'Invité';
	}
});