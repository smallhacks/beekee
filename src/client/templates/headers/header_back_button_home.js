Template.headerBackButtonHome.events({
	
	'click .header--button-back': function(e) {
		e.preventDefault();
		if (Meteor.user())
			Router.go('indexTeacher');
		else
			Router.go('indexStudent');
  	}
});