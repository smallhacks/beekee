Template.resourcesPostSubmit.onRendered(function() {

	$(".resources-category-submit--form").validate({
        rules: {
            categoryName: {
                required: true,
                minlength: 1,
                maxlength: 20
            }
        }
    }); 

    Session.set('numChars', 0); // Count the number of characters
});


Template.resourcesCategorySubmit.events({

	'submit form': function(e, template) {
		 e.preventDefault();

		var spaceId = template.data.space._id;
		var categoryType = 'resource';

		var categoryName = $('#categoryName').val().trim();
		Meteor.call('categoryInsert', categoryType, categoryName, spaceId, function(error) {
			if (error)
				alert(TAPi18n.__('error-message')+error.message);
			else {
				$('#resourcesCategorySubmit').modal('hide');

				// Select the new category after submitted
				$('[name=categorySelect]').val(categoryName); 
				resourcesResetFilters();
				Session.set('resourcesCategory',categoryName);
			}
		});
		$('#categoryName').val('');
		Session.set('numChars', 0); // Count the number of characters
	},
	'click .resources-category-submit--button-submit': function(e) {
		e.preventDefault();
		$('#resources-category-submit--form').submit();
	},
	'input #categoryName': function(){
    	Session.set('numChars', $('#categoryName').val().length);
  	}
});


Template.resourcesCategorySubmit.helpers({

	'numChars': function(menuItemId) {
		return Session.get('numChars');
	},
});