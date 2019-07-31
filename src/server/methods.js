Meteor.startup(function() {


	// ###  Mail configuration  ###
	process.env.MAIL_URL = 'smtp://'+Meteor.settings.mailAddress+':'+Meteor.settings.mailPassword+'@'+Meteor.settings.mailServer;          
	Accounts.emailTemplates.from = "Beekee Live <vincent.widmer@beekee.ch>";

	// Reset Password mail configuration
	Accounts.emailTemplates.resetPassword.text = function (user, url) {
 		return "Hi, \n\n You recently requested to reset your password for your Beekee Live account.\n\n Click the link below to reset it. : \n"
		+ url
		+ "\n\n If you did not requested a password reset, please ignore this email."
		+ "\n\n Thanks,"
		+ "\n\n Beekee Live Team";
	};
	Accounts.emailTemplates.resetPassword.subject = function () {
 		return "Reset your Beekee Live password";
	};

	Accounts.urls.resetPassword = function(token) {
		return 'http://live.beekee.ch/reset-password/' + token;
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
			html: text
		});
	},
	'adminSetNewPassword': function(adminId, userId, newPassword) { // Admin can forcibly change the password for a user
		if (Roles.userIsInRole(adminId, 'admin')) {
			console.log("bien admin");
			Accounts.setPassword(userId, newPassword);
		}
	},
	'createAccount': function(email, password, profile) {
		Accounts.createUser({email:email,password:password,profile:profile}); // Callback is not supported on server-side
	},
	'deleteUser': function(userId) {
		Meteor.users.remove(userId, function (error, result) {
			if (error) {
				console.log("Error when deleting user : "+error.message);
			}
		});
	},
	'getIP': function() { // Get IP of box
			var res;
			res = cmd("ifconfig eth0 2>/dev/null|awk '/inet addr:/ {print $2}'|sed 's/addr://'");
			return res;
	},
	'getRaspbianVersion': function() {
		var res;
		res = cmd("cat /etc/debian_version");
		return res;
	},
	'getUsedSpace': function() {
		var res;
		res = cmd("df / -h | awk '{print ($3)}' | tail -1") + "/ " + cmd("df / -h | awk '{print ($2)}' | tail -1") + " ("+cmd("df / | awk '{print ($5)}' | tail -1")+"used)";
		return res;
	},
	'getBeekeeVersion': function() {
		json = JSON.parse(Assets.getText("version.json"));
		//json = JSON.parse(Assets.getText("version.json"));
		return json.version;
	},
	'getBoxSerial': function() {
		return Meteor.settings.serial;
	},
	'rebootBox': function() { // Shutdown the Raspberry Pi
			var res;
			res = cmd("sudo reboot");
			return res;
	},
	'shutdownBox': function() { // Shutdown the Raspberry Pi
			var res;
			res = cmd("sudo shutdown");
			return res;
	}
});