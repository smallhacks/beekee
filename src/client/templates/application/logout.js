Template.logout.events({
	
	'click .logout--button-confirm': function(e) {
		e.preventDefault();
		Meteor.logout(); 
		Router.go('indexTeacher');
	}
});