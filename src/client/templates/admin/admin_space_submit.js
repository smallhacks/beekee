// Copyright 2016-2021 VINCENT WIDMER

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


Template.adminSpaceSubmit.onRendered(function () {

    $(".admin-space-submit--form").validate({
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


Template.adminSpaceSubmit.events({

	'submit form': function(e, template) {
		 e.preventDefault();

		var space = {
			title: $('#spaceName').val().trim(),
			lang: Session.get('lang')
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