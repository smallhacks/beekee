import { Spaces } from '../api/spaces.js';


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