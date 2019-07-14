// ###### General router configuration ######

Router.configure({
	loadingTemplate: 'loading',
	notFoundTemplate: 'notFound',
	trackPageView: true // Google Analytics tracking
});

// Add Google Analytics tracking
// if (Meteor.isClient) {
//     Router.plugin('reywood:iron-router-ga');
// }


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

Router.onBeforeAction(requireLogin, {only: 'settings'});

var pathsRequireAdmin;
if (Meteor.settings.public.isBox === "true")
	pathsRequireAdmin = ['admin','register','update'];
else
	pathsRequireAdmin = ['admin','update'];

Router.onBeforeAction(requireAdmin, {only: pathsRequireAdmin});


// ###### Routes without controller ######

Router.route('/not-found', {
	name: 'notFound',
	fastRender: true
});

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

Router.route('/update', {
	name: 'update',
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

Router.route('/lesson/:_id', {
	name: 'lessonsFrame',
	controller: 'LessonsFrameController'
});

Router.route('/space/:_id', {
	name: 'space',
	controller: 'SpaceController'
});

// BIOSCOPE ARBRE special routes
Router.route('/arbre', function () {
  this.redirect('/space/NydEZucScvRDW8oPA');
});

Router.route('/arbre/bioscope-ipad', function () {
  this.redirect('/space/NydEZucScvRDW8oPA/bioscope-ipad');
});

Router.route('/space/:_id/bioscope-ipad', {
	name: 'bioscopeiPadRoute',
	controller: 'bioscopeiPadRouteController',
	fastRender: true
});

Router.route('/arbre/bioscope-map', function () {
  this.redirect('/space/NydEZucScvRDW8oPA/bioscope-map');
});

Router.route('/space/:_id/bioscope-map', {
	name: 'bioscopeMapRoute',
	controller: 'bioscopeMapRouteController',
	fastRender: true
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