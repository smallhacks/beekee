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


Template.resources.onRendered(function() {

	$('.modal').on('shown.bs.modal', function (e) {
		  $(this).find('[autofocus]').focus();
	});

	resourcesResetFilters();

	this.autorun(function() { // Autorun to reactively update subscription (filtering + interval of loaded posts)

		var filters = {spaceId:Session.get('spaceId'), type:"resource"};
		if (Session.get('resourcesCategory') != "") {
			filters = {spaceId:Session.get('spaceId'), type:"resource", category:Session.get('resourcesCategory')};
		}

		subscription = Meteor.subscribe('posts', filters);
	});
});



Template.resources.helpers({

	resourcesPosts: function() {
		return Posts.find({spaceId:Session.get('spaceId'), type:"resource"},{sort: {submitted: 1}});
	}
});


resourcesResetFilters = function() {
	Session.set('resourcesCategory','');
}