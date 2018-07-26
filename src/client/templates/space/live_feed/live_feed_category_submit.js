Template.liveFeedCategorySubmit.events({

	'submit form': function(e, template) {
		 e.preventDefault();

		var spaceId = template.data.space._id;

		var categoryName = $('#categoryName').val().trim();
		Meteor.call('categoryInsert', categoryName, spaceId, function(error) {
			if (error)
				alert(TAPi18n.__('error-message')+error.message);
			else {
				$('#liveFeedCategorySubmit').modal('hide');
				$('[name=categorySelect]').val(categoryName);
			}
		});
		$('#categoryName').val('');
	},
	'click .live-feed-category-submit--button-submit': function(e) {
		e.preventDefault();
		$('#live-feed-category-submit--form').submit();
	}
});