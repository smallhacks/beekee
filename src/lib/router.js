// ###### General router configuration ######

Router.configure({
	loadingTemplate: 'loading',
	notFoundTemplate: 'notFound',
	trackPageView: true
});


Router.configureBodyParsers = function() {
	Router.onBeforeAction(Iron.Router.bodyParser.urlencoded({
		extended: true,
		limit: '50mb'
	}));
};


// Auto-close slide menu on route stop (when navigating to a new route)
Router.onStop(function () {
	if (typeof slideout != 'undefined')
		slideout.close();
});


// ###### Router security hooks ######

var requireLogin = function() {
		if (! Meteor.user()) {
				if (Meteor.loggingIn()) {
						this.render(this.loadingTemplate);
				} else {
						this.render('accessDenied');
				}
		} else {
				this.next();
		}
}

var requireAdmin = function() {
		if (! Roles.userIsInRole(Meteor.user(), 'admin')) {
				if (Meteor.loggingIn()) {
						this.render(this.loadingTemplate);
				} else {
					this.render('spacesHeader', {to: 'layout--header'});
					this.render('accessDenied');
				}
		} else {
				this.next();
		}
}

Router.onBeforeAction(requireLogin, {only: 'spaceSubmit'});
Router.onBeforeAction(requireAdmin, {only: 'admin'});


// ###### Routes without controller ######

Router.route('/privacy', {
	name: 'privacy',
	fastRender: true
});

Router.route('/login', {
	name: 'login',
	fastRender: true
});

Router.route('/register', {
	name: 'register',
	fastRender: true
});


// ###### Routes with controller ######

Router.route('/user', {
	name: 'userSettings',
	controller: 'UserSettingsController',
	fastRender: true
});

Router.route('/admin', {
	name: 'admin', 
	controller: 'AdminController' 
});

Router.route('/', {
	name: 'indexStudent',
	controller: 'IndexStudentController'
});

Router.route('/teacher', {
	name: 'indexTeacher',
	controller: 'IndexTeacherController'
});

Router.route('/space/:_id', {
	name: 'space',
	controller: 'SpaceController'
});

Router.route('/space/:_id/settings', {
	name: 'settings',
	controller: 'SettingsController'
});

Router.route('/space/:_id/users', {
	name: 'spaceUsers',
	controller: 'SpaceUsersController'
});

Router.route('/space/:_id/first-connection', {
	name: 'spaceUsersFirstConnection',
	controller: 'SpaceFirstConnectionController'
});

Router.route('/reset-password/:token', {
	name: 'resetPassword',
	controller: 'ResetPasswordController'
});