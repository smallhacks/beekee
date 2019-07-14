Template.spaceSubmit.onRendered(function () {

    $(".space-submit--form").validate({
        rules: {
            "spaceName": {
                required: true,
                minlength: 3,
                maxlength: 35
            }
        }
    }); 

    Session.set('numChars', 0); // Count the number of characters
});


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
	},
	'input #spaceName': function(){
    	Session.set('numChars', $('#spaceName').val().length);
  	}
});


Template.spaceSubmit.helpers({

	'numChars': function(menuItemId) {
		return Session.get('numChars');
	},
});