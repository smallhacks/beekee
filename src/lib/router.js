// ###### General router configuration ######

Router.configure({
	loadingTemplate: 'loading',
	layoutTemplate: 'layout',
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
	yieldTemplates: {
		'headerBackButton': {to: 'layout--header'},
		'privacy': {to: 'layout--main'}
	},
	fastRender: true
});

Router.route('/submit', {
	name: 'spaceSubmit',
	yieldTemplates: {
		'header': {to: 'layout--header'},
		'spaceSubmit': {to: 'layout--main'}
	},
	fastRender: true
});

Router.route('/login', {
	name: 'login',
	yieldTemplates: {
		'loginHeader': {to: 'layout--header'},
		'login': {to: 'layout--main'}
	},
	fastRender: true
});

Router.route('/logout', {
	name: 'logout',
	yieldTemplates:{
		'headerBackButton': {to: 'layout--header'},
		'logout': {to: 'layout--main'}
	},
	fastRender: true
});

Router.route('/register', {
	name: 'register',
	yieldTemplates: {
		'registerHeader': {to: 'layout--header'},
		'register': {to: 'layout--main'}
	},
	fastRender: true
});


// ###### Routes with controller ######

Router.route('/admin', {
	name: 'admin', 
	yieldTemplates: {
		'admin': {to: 'layout--main'}
	},
	controller: 'AdminController' 
});

Router.route('/space/:_id/edit/authors', {
	name: 'spaceEditAuthors',
	yieldTemplates: {
		'spaceEditAuthors': {to: 'layout--main'}
	},
	controller: 'SpaceEditAuthorsController'
});

Router.route('/space/:_id/edit/categories', {
	name: 'spaceEditCategories',
	yieldTemplates: {
		'spaceEditCategories': {to: 'layout--main'}
				},
	controller: 'SpaceEditCategoriesController'
});

Router.route('/space/:_id/edit', {
	name: 'spaceEdit',
	yieldTemplates: {
		'spaceEdit': {to: 'layout--main'}
	},
	controller: 'SpaceEditController' 
});

Router.route('/', {
	name: 'indexStudent',
	yieldTemplates: {
		'indexStudent': {to: 'layout--main'}
	},
	controller: 'IndexStudentController'
});

Router.route('/teacher', {
	name: 'indexTeacher',
	yieldTemplates: {
		'indexTeacher': {to: 'layout--main'}
	},
	controller: 'IndexTeacherController'
});

Router.route('/space/:_id', {
	name: 'spacePage',
	yieldTemplates: {
		'spacePage': {to: 'layout--main'}
	},
	controller: 'SpacePageController'
});

Router.route('/space/:_id/first-connection', {
	name: 'firstConnection',
	yieldTemplates: {
		'spaceUsers': {to: 'layout--main'}
	},
	controller: 'SpaceFirstConnectionController'
});

Router.route('/space/:_id/users', {
	name: 'spaceUsers',
	yieldTemplates: {
		'spaceUsers': {to: 'layout--main'}
	},
	controller: 'SpaceUsersController'
});

Router.route('/publication/:_id/edit',{
	name: 'postEdit',
	yieldTemplates: {
		'postEdit': {to: 'layout--main'}
	},
	controller: 'PostEditController'
});

Router.route('/space/:_id/submit', {
	name: 'postSubmit',
	yieldTemplates: {
		'postSubmit': {to: 'layout--main'}
	},
	controller: 'PostSubmitController'
});

Router.route('/reset-password/:token', {
	name: 'resetPassword',
	yieldTemplates: {
		'loginHeader': {to: 'layout--header'},
		'resetPassword': {to: 'layout--main'}
	},
	controller: 'ResetPasswordController'
});