Template.spaceSubmit.events({

	'submit form': function(e, template) {
		 e.preventDefault();

		var space = {
			title: $('#spaceName').val().trim()
		};

		Meteor.call('spaceInsert', space, function(error, result) {
			if(error)
				alert(TAPi18n.__('error-message')+error.message);
			else {
				//Router.go('space', {_id: result._id});
				$('#spaceSubmit').modal('hide');
			}       
		});

		$('#spaceName').val('');
	},
	'click .space-submit--button-submit': function(e) {
		e.preventDefault();
		$('#space-submit--form').submit();
	}
});