import { Template } from 'meteor/templating';

import './live_feed_category_edit.html';


Template.liveFeedCategoryEdit.onRendered(function() {

	$(".live-feed-category-edit--form").validate({
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


Template.liveFeedCategoryEdit.events({

	'submit form': function(e, template) {
		 e.preventDefault();

		var spaceId = template.data.space._id;

		var currentCategoryName = Session.get('liveFeedCategoryToEdit');
		var categoryType = 'liveFeed';

		var newCategoryName = $(e.target).find('[name=editCategoryName]').val();
		if (currentCategoryName != newCategoryName) {

			Meteor.call('categoryEdit', spaceId, categoryType, currentCategoryName, newCategoryName, function(error) {
				if (error)
						alert(TAPi18n.__('error-message')+error.message);
				else {
					$('#liveFeedCategoryEdit').modal('hide');
					Session.set('liveFeedCategoryToEdit',null);
				}
			});
			$('#editCategoryName').val('');
			Session.set('numChars', 0); // Count the number of characters
		}
		else {
			$('#liveFeedCategoryEdit').modal('hide');
			Session.set('liveFeedCategoryToEdit',null);
		}
	},
	'click .live-feed-category-edit--button-submit': function(e) {
		e.preventDefault();
		$('#live-feed-category-edit--form').submit();
	},
	'click .live-feed-category-edit--button-delete': function(e, template) {
		e.preventDefault();

		var spaceId = template.data.space._id;
		var categoryName = Session.get('liveFeedCategoryToEdit');
		var categoryType = 'liveFeed';

		Meteor.call('categoryDelete', categoryType, categoryName, spaceId, function(error) {
			if (error)
					alert(TAPi18n.__('error-message')+error.message);
			else {
				$('#liveFeedCategoryEdit').modal('hide');
				Session.set('liveFeedCategoryToEdit',null);
			}
		});
	},
	'input #editCategoryName': function(){
    	Session.set('numChars', $('#editCategoryName').val().length);
  	}
});


Template.liveFeedCategoryEdit.helpers({

	categoryName: function() {
		var categoryName = Session.get('liveFeedCategoryToEdit');
		return categoryName
	},
	'numChars': function(menuItemId) {
		return Session.get('numChars');
	},
});