import { Template } from 'meteor/templating';
import { Categories } from '../../../api/categories.js';

import './resources_category_edit.html';


Template.resourcesCategoryEdit.onRendered(function() {

	$(".resources-category-edit--form").validate({
        rules: {
            editCategoryName: {
                required: true,
                minlength: 1,
                maxlength: 20
            }
        }
    }); 
    Session.set('numChars', $('#editCategoryName').val().length); // Count the number of characters
});


Template.resourcesCategoryEdit.events({

	'submit form': function(e, template) {
		 e.preventDefault();

		var spaceId = template.data.space._id;

		var currentCategoryName = Session.get('resourcesCategoryToEdit');
		var categoryType = 'resource';

		var newCategoryName = $(e.target).find('[name=editCategoryName]').val();
		if (currentCategoryName != newCategoryName) {

			Meteor.call('categoryEdit', spaceId, categoryType, currentCategoryName, newCategoryName, function(error) {
				if (error)
						alert(TAPi18n.__('error-message')+error.message);
				else {
					$('#resourcesCategoryEdit').modal('hide');
					Session.set('resourcesCategoryToEdit',null);
				}
			});
			$('#editCategoryName').val('');
			Session.set('numChars', 0); // Count the number of characters
		}
		else {
			$('#resourcesCategoryEdit').modal('hide');
			Session.set('resourcesCategoryToEdit',null);	
		}
	},
	'click .resources-category-edit--button-submit': function(e) {
		e.preventDefault();
		$('#resources-category-edit--form').submit();
	},
	'click .resources-category-edit--button-delete': function(e, template) {
		e.preventDefault();

		var spaceId = template.data.space._id;
		var categoryName = Session.get('resourcesCategoryToEdit');
		var categoryType = 'resource';

		Meteor.call('categoryDelete', categoryType, categoryName, spaceId, function(error) {
			if (error)
					alert(TAPi18n.__('error-message')+error.message);
			else {
				$('#resourcesCategoryEdit').modal('hide');
				Session.set('resourcesCategoryToEdit',null);
			}
		});
	},
	'input #editCategoryName': function(){
    	Session.set('numChars', $('#editCategoryName').val().length);
  	}
});


Template.resourcesCategoryEdit.helpers({

	categoryName: function() {
		var categoryName = Session.get('resourcesCategoryToEdit');
		return categoryName
	},
	'numChars': function(menuItemId) {
		return Session.get('numChars');
	},
});