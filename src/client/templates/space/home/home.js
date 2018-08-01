Template.home.events({
	
	'click .home--submit': function(e) {
		e.preventDefault();
		
		$('#homePostSubmit').modal('show');

		tinymce.init({
		  	selector: 'textarea#body-submit-tinymce',
		  	skin_url: '/packages/teamon_tinymce/skins/lightgray',
		});

		$('#homePostSubmit').on('show.bs.modal', function (e) {
			tinymce.init({
		  		selector: 'textarea#body-submit-tinymce',
		  		skin_url: '/packages/teamon_tinymce/skins/lightgray',
			});
		})

		$('#homePostSubmit').on('hide.bs.modal', function (e) {
			tinymce.remove( "textarea#body-submit-tinymce" );
			
		})
	},
	'click .home--hide-code-panel':function(e) {
		e.preventDefault();

		Spaces.update({_id:this.space._id},{$set: {codePanel:false}});
	}
});

Template.home.helpers({

	homePosts: function() {
		return Posts.find({},{sort: {submitted: 1}});
	},
	codePanel: function() {
		return this.space.codePanel;
	}
});