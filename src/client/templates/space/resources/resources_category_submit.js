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