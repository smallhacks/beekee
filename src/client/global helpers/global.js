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


// Global helpers

// Check in settings.json if the server is a box or a web server
Template.registerHelper("isBox", function () {
    return (Meteor.settings.public.isBox === "true");
});


Template.registerHelper("ownSpace", function () {

	var spaceId = Session.get('spaceId');
	var spaceUserId = Spaces.findOne(spaceId).userId;

	var userId = Meteor.userId();
	var isAdmin = Roles.userIsInRole(Meteor.userId(), ['admin'])
	if (userId)
		if (spaceUserId === userId)
			return true;
	else if (isAdmin)
		if (isAdmin === true)
			return true;
	else
		return false;
});