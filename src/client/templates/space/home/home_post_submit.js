// Copyright 2016-2020 UNIVERSITY OF GENEVA (GENEVA, SWITZERLAND)

// This file is part of Beekee Live.
    
// Beekee Live is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Beekee Live is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
//  along with Beekee Live.  If not, see <https://www.gnu.org/licenses/>.

//**************************************************************************


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