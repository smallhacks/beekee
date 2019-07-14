Template.spaceUsersFirstConnection.onRendered(function () {

		Session.set('lang','fr-FR');

		TAPi18n.setLanguage(Session.get('lang')); // Translation of app-specific texts
		T9n.setLanguage(Session.get('lang')); // Translation for basic Meteor packages (account, etc.)
		moment.locale(Session.get('lang')); // Translation for livestamp
 
    $("#space-users-first-connection--form").validate({
        rules: {
            "author-name": {
                required: true,
                minlength: 3,
                maxlength: 20
            }
        }
    }); 
	
    // Enable autofocus
	$('#space-users-first-connection--author-name').focus();
});


Template.spaceUsersFirstConnection.events({
	
	'submit form': function(event, template) {
		event.preventDefault();

		var authorName = $('#space-users-first-connection--author-name').val().trim();
		var email = $('#space-users--email').val();
		console.log("adresse mail : "+email);

		if (authorName != "") {
			if (Authors.findOne({name:authorName})) {
				if (confirm(TAPi18n.__('space-users--user-exist',authorName))) {
					Session.setPersistent(template.data.space._id, {author: authorName}); // Persistent to browser refresh
					Router.go('space', {_id: template.data.space._id});
				}
				else
					return;
			}
			else {
				Meteor.call('authorInsert', authorName, email, template.data.space._id, function(error) {
					if(error)
						alert(TAPi18n.__('error-message')+error.message);
					else {
						Session.setPersistent(template.data.space._id, {author: authorName, favorites: []});
						Router.go('space', {_id: template.data.space._id});					
					} 
				});
			}
		}
	},
	'click .space-users--button-submit-author': function(event, template) {
		event.preventDefault();
		$('#space-users-first-connection--form').submit();
	},
	'change .space-users--email-checkbox': function(event) {
		console.log("change : "+event.target.checked);
 	 var x = event.target.checked;
 	 if (x == true) {
 	 	$('#space-users--email').removeClass("d-none");

 	 } else {
 	 	$('#space-users--email').addClass("d-none");

 	 }
  		//Session.set("statevalue", x);
  	//console.log(Session.get("statevalue"));
	 }
});