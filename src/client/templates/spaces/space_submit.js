Template.spaceSubmit.onRendered(function() {

	this.$('.space-submit--input').focus();
});


Template.spaceSubmit.events({
	
	'submit form': function(e) {
		e.preventDefault();

		var space = {
			title: $(e.target).find('[name=title]').val()
		};
		
		Meteor.call('spaceInsert', space, function(error, result) {
			if(error)
				alert(TAPi18n.__('error-message')+error.message);
			else {
				Router.go('spacePage', {_id: result._id});
			}       
		});
	},
	'click .space-submit--button-submit': function(e) {
		e.preventDefault();
		$('#space-submit--form').submit();
	},
	'click .space-submit--button-cancel': function(e) {
		e.preventDefault();
		history.back();  
	}     
});