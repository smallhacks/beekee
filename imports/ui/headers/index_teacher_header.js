import { Template } from 'meteor/templating';


Template.indexTeacherHeader.helpers({
	
	adminName: function() {
		return Meteor.user().profile.name;
	}
});