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
	}
});


Template.liveFeedCategoryEdit.helpers({

	categoryName: function() {
		var categoryName = Session.get('categoryToEdit');
		return categoryName
	}
});