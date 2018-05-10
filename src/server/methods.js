Meteor.startup(function() {


	// ###  Mail configuration  ###

	//process.env.MAIL_URL = 'smtp://vincent.widmer@beekee.ch:1234512345@mail.infomaniak.com:587/';          
	process.env.MAIL_URL = 'smtp://'+Meteor.settings.mailAddress+':'+Meteor.settings.mailPassword+'@'+Meteor.settings.mailServer;          
	Accounts.emailTemplates.from = "beekee.ch <vincent.widmer@beekee.ch>";

	// Reset Password mail configuration
	Accounts.emailTemplates.resetPassword.text = function (user, url) {
 		return "Bonjour, \n\n Vous avez demandé à réinitialiser votre mot de passe.\n\n Si c'est bien le cas, cliquez sur le lien suivant : \n"
		+ url
		+ "\n\n L'équipe beekee.ch";
	};
	Accounts.emailTemplates.resetPassword.subject = function () {
 		return "Réinitialisation de votre mot de passe";
	};

	Accounts.urls.resetPassword = function(token) {
		return 'http://web.beekee.ch/reset-password/' + token;
	};
});


exec = Npm.require('child_process').exec; // No idea what is this ?
cmd = Meteor.wrapAsync(exec);


Meteor.methods({
	sendEmail: function (to, from, subject, text) {
		check([to, from, subject, text], [String]);

		// Let other method calls from the same client start running, without waiting for the email sending to complete.
		this.unblock();

		Email.send({
			to: to,
			from: from,
			subject: subject,
			text: text
		});
	},
	'adminSetNewPassword': function(adminId, userId, newPassword) { // Admin can forcibly change the password for a user
		if (Roles.userIsInRole(adminId, 'admin')) {
			console.log("bien admin");
			Accounts.setPassword(userId, newPassword);
		}
	},
	'getIP': function() { // Get IP of box
			var res;
			res = cmd("ifconfig eth0 2>/dev/null|awk '/inet addr:/ {print $2}'|sed 's/addr://'");
			return res;
	},
	'shutdownBox': function() { // Shutdown the Raspberry Pi
			var res;
			res = cmd("sudo shutdown");
			return res;
	}
});