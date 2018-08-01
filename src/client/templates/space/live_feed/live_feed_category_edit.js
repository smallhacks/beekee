Template.liveFeedCategoryEdit.onRendered(function() {

	$(".live-feed-category-edit--form").validate({
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


Template.liveFeedCategoryEdit.events({

	'submit form': function(e, template) {
		 e.preventDefault();

		var spaceId = template.data.space._id;

		var currentCategoryName = Session.get('categoryToEdit');
		var newCategoryName = $(e.target).find('[name=categoryName]').val();
		if (currentCategoryName != newCategoryName) {

			Meteor.call('categoryEdit', spaceId, currentCategoryName, newCategoryName, function(error) {
				if (error)
						alert(TAPi18n.__('error-message')+error.message);
				else {
					$('#liveFeedCategoryEdit').modal('hide');
					Session.set('categoryToEdit',null);
				}
			});
			$('#categoryName').val('');
			Session.set('numChars', 0); // Count the number of characters
		}
	},
	'click .live-feed-category-edit--button-submit': function(e) {
		e.preventDefault();
		$('#live-feed-category-edit--form').submit();
	},
	'click .live-feed-category-edit--button-delete': function(e, template) {
		e.preventDefault();

		var spaceId = template.data.space._id;
		var categoryName = Session.get('categoryToEdit');
		console.log("categoryName : "+categoryName);

		Meteor.call('categoryDelete', categoryName, spaceId, function(error) {
			if (error)
					alert(TAPi18n.__('error-message')+error.message);
			else {
				$('#liveFeedCategoryEdit').modal('hide');
				Session.set('categoryToEdit',null);
			}
		});
	},
	'input #categoryName': function(){
    	Session.set('numChars', $('#categoryName').val().length);
  	}
});


Template.liveFeedCategoryEdit.helpers({

	categoryName: function() {
		var categoryName = Session.get('categoryToEdit');
		return categoryName
	},
	'numChars': function(menuItemId) {
		return Session.get('numChars');
	},
});