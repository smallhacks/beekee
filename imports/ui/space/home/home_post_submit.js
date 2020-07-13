import { Template } from 'meteor/templating';


import './home_post_submit.html';

Template.homePostSubmit.onCreated(function() {

	toastr.options = {
	  	"positionClass": "toast-bottom-center",
	}
});


Template.homePostSubmit.events({

	'submit form': function(e, template) {
		 e.preventDefault();

		var title = $(e.target).find('[name=title]').val();
		var body = tinymce.activeEditor.getContent();

		var spaceId = template.data.space._id;

		Meteor.call('homePostInsert', {body: body, spaceId: spaceId, title: title, type: "home"}, function(error, postId) {
			if (error){
				alert(TAPi18n.__('error-message')+error.message);
			} else {

				tinymce.activeEditor.setContent(''); // Remove textarea content
				$(e.target).find('[name=title]').val('');
				$('#homePostSubmit').modal('hide');
				toastr.success("",TAPi18n.__('home-post-submit--confirm-toast'));
			};
		});
	},
	'click .home-post-submit--button-submit': function(e) {
		e.preventDefault();
		$('#home-post-submit--form').submit();
	}
});