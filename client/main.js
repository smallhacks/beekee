import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';
import './stylesheets/custom.css';
import './stylesheets/sidebar.css';
import '../imports/ui/index/index_student.js';
import '../imports/ui/index/index_teacher.js';
import '../imports/ui/account/login.js';
import '../imports/ui/account/reset-password.js';
import '../imports/ui/account/user_settings.js';
import '../imports/ui/account/register.js';
import '../imports/ui/space/space_submit.js';
import '../imports/ui/space/space.js';
import '../imports/ui/space/space_users_first_connection.js';
import '../imports/ui/space/space_users.js';
import '../imports/ui/space/settings/settings.js';
import '../imports/ui/space/resources/resources.js';
import '../imports/ui/global_helpers.js';
import '../imports/ui/admin/admin.js';
import '../imports/ui/misc/access_denied.js';
import '../imports/ui/misc/privacy.html';
import '../imports/ui/misc/loading.html';
import '../imports/ui/misc/not_found.html';
import '../imports/api/posts.js';
import '../lib/router.js';
import '/lib/app_loader.js';


if (Meteor.isClient) {

	// Check in settings if the app is running on a Beekee Box or a online server
	Template.registerHelper("isBox", function () {
		return (Meteor.settings.public.isBox === "true");
	});

	// 
	Template.registerHelper("googleSiteVerification", function () {
		return Meteor.settings.public.google_site_verification;
	});


	if (Meteor.settings.public.isBox) {

		// Allow cross-app login
		// Store Token in a Cookie
		Accounts.onLogin(function(){
			console.log("We set a cookie with Token : "+Accounts._storedLoginToken());
			Cookie.set('_storedLoginToken', Accounts._storedLoginToken(), {domain:'beekee.box', expires: 30});
		});

		Tracker.autorun(function(){
			var user = Accounts.user();
			if (user === null) {
				console.log("We already have a token : "+Cookie.get('_storedLoginToken'));
				token = Cookie.get('_storedLoginToken');
				Accounts.loginWithToken(token, function(err) {
					console.log("Error while loginWithToken : "+err);
				});
			}
		});
	}
}