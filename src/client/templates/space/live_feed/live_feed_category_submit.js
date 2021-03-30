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


Template.liveFeedPostSubmit.onRendered(function() {

	$(".live-feed-category-submit--form").validate({
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


Template.liveFeedCategorySubmit.events({

	'submit form': function(e, template) {
		 e.preventDefault();

		var spaceId = template.data.space._id;
		var categoryType = 'liveFeed';

		var categoryName = $('#categoryName').val().trim();
		Meteor.call('categoryInsert', categoryType, categoryName, spaceId, function(error) {
			if (error)
				alert(TAPi18n.__('error-message')+error.message);
			else {
				$('#liveFeedCategorySubmit').modal('hide');

				// Select the new category after submitted
				$('[name=categorySelect]').val(categoryName); 
				liveFeedResetFilters();
				Session.set('liveFeedCategory',categoryName);
				Session.set('postsServerNonReactive', Categories.findOne({name:categoryName, type: categoryType}).nRefs);
				liveFeedResetPostInterval();
			}
		});
		$('#categoryName').val('');
		Session.set('numChars', 0); // Count the number of characters
	},
	'click .live-feed-category-submit--button-submit': function(e) {
		e.preventDefault();
		$('#live-feed-category-submit--form').submit();
	},
	'input #categoryName': function(){
    	Session.set('numChars', $('#categoryName').val().length);
  	}
});


Template.liveFeedCategorySubmit.helpers({

	'numChars': function(menuItemId) {
		return Session.get('numChars');
	},
});