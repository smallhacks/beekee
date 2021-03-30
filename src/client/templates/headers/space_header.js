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


Template.spaceHeader.events({

	'click .menu-item': function(e) {
		e.preventDefault();
		var menuItemId = $(e.currentTarget).attr("data-id");
		Session.set('menuItem',menuItemId);
	}
	// 'click #sidebarCollapse': function(e) {
 //        $('#sidebar').toggleClass('active');
	// }
});

Template.spaceHeader.helpers({
	
	authorName: function() {
		if (Session.get(this.space._id).author)
		return Session.get(this.space._id).author; 
	},
	adminName: function() {
		return Meteor.user().profile.name;
	},
	ownSpace: function() {
		var userId = Meteor.userId();
		var isAdmin = Roles.userIsInRole(Meteor.userId(), ['admin'])
		if (userId)
			if (this.space.userId === userId)
				return true;
		else if (isAdmin)
			if (isAdmin === true)
				return true;
		else
			return false;
	}
});