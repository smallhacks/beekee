import { Spaces } from '../imports/api/spaces.js';


// ###  Create admin user at first start  ###

if (Spaces.find().count() === 0) {
	if (Meteor.users.find().count() === 0) {

		// Create the admin role
		Roles.createRole('admin', {unlessExists: true});

		var adminPassword = Meteor.settings.adminPassword;

		var users = [
			{username:"admin",roles:['admin']},
		];

		_.each(users, function (user) {
			var id;
			id = Accounts.createUser({
				username: user.username,
				email: "admin@beekee.ch",
				//password: adminPassword,
				password: "admin",
				profile:{name:"Admin"}
			});

			if (user.roles.length > 0) {
				Roles.addUsersToRoles(id, user.roles);
			}
		});
	}
}