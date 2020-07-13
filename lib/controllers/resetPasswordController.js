ResetPasswordController = RouteController.extend({

	onBeforeAction: function() {
		Accounts._resetPasswordToken = this.params.token;
		this.next();
	},

	action: function () {
		this.render();
	},

	fastRender: true
});