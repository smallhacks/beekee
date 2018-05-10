Meteor.startup(function() {


	// ###  Mail configuration  ###
	process.env.MAIL_URL = 'smtp://'+Meteor.settings.mailAddress+':'+Meteor.settings.mailPassword+'@'+Meteor.settings.mailServer;          
	Accounts.emailTemplates.from = "beekee.ch <vincent.widmer@beekee.ch>";

	// Reset Password mail configuration
	Accounts.emailTemplates.resetPassword.text = function (user, url) {
 		return "Hi, \n\n You recently requested to reset your password for your Beekee account.\n\n Click the link below to reset it. : \n"
		+ url
		+ "\n\n If you did not requested a password reset, please ignore this email."
		+ "\n\n Thanks,"
		+ "\n\n Beekee Team";
	};
	Accounts.emailTemplates.resetPassword.subject = function () {
 		return "Reset your Beekee password";
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