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


// ###  Create admin user at first start  ###

if (Spaces.find().count() === 0) {
	if (Meteor.users.find().count() === 0) {
		var adminPassword = Meteor.settings.adminPassword;

		var users = [
			{username:"admin",roles:['admin']},
		];

		_.each(users, function (user) {
			var id;
			id = Accounts.createUser({
				username: user.username,
				email: "Admin",
				password: adminPassword,
				profile:{name:"Admin"}
			});

			if (user.roles.length > 0) {
				Roles.addUsersToRoles(id, user.roles);
			}
		});
	}
}