Template.adminSpaceSubmit.onRendered(function () {

    $(".admin-space-submit--form").validate({
        rules: {
            "spaceName": {
                required: true,
                minlength: 3,
                maxlength: 20
            }
        }
    }); 

    Session.set('numChars', 0); // Count the number of characters
});


Template.adminSpaceSubmit.events({

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
				$('#adminSpaceSubmit').modal('hide');
			}       
		});

		$('#spaceName').val('');
	},
	'click .admin-space-submit--button-submit': function(e) {
		e.preventDefault();
		$('#admin-space-submit--form').submit();
	},
	'input #spaceName': function(){
    	Session.set('numChars', $('#spaceName').val().length);
  	}
});


Template.adminSpaceSubmit.helpers({

	'numChars': function(menuItemId) {
		return Session.get('numChars');
	},
});