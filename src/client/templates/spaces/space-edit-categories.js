Template.spaceEditCategories.events({

	'click .space-edit-categories--button-delete-category': function(event, template) {
		var currentSpaceId = template.data.space._id;
		var categoryName = $(event.target).data("delete-name");
		var category = Categories.findOne({name: categoryName, spaceId: currentSpaceId});
		if(confirm(TAPi18n.__('space-edit-categories--confirm-delete')+" "+categoryName+" ?"))
			Categories.remove(category._id, function(error) {
				if (error)
					alert(TAPi18n.__('error-message')+error.message);
		});
	}, 
	'click .space-edit-categories--button-edit-category': function(event, template) {
		var currentSpaceId = template.data.space._id;
		var oldName = $(event.target).data("edit-category");
		var newName = prompt(TAPi18n.__('space-edit-categories--edit-category')+" : ",oldName);
		Meteor.call('categoryEdit', currentSpaceId, oldName, newName, function(error) {
			if (error)
					alert(TAPi18n.__('error-message')+error.message);
		});
	},
	'submit form.space-edit--form-add-category': function(e) {
		e.preventDefault();
		var currentSpaceId = this.space._id;
		var categoryName = $('#categoryName').val().trim();
		Meteor.call('categoryInsert', categoryName, this.space._id, function(error) {
			if (error)
					alert(TAPi18n.__('error-message')+error.message);
		});
		$('#categoryName').val('');
		$('*[data-category="'+categoryName+'"]').css("background-color", "#77b3d4"); // Animation when add a category
		setTimeout(function(){  $('*[data-category="'+categoryName+'"]').css("background-color", "");}, 1000);
	}
});


Template.spaceEditCategories.helpers({
	
	categories: function(){
		return Categories.find({spaceId: this.space._id}, {sort: { name: 1 }});  
	}
});