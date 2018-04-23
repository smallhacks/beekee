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
				password: adminPassword
			});

			if (user.roles.length > 0) {
				Roles.addUsersToRoles(id, user.roles);
			}
		});
	}
}