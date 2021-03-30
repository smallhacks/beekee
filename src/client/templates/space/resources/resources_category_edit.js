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