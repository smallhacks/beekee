Template.admin.events({

	'click .admin--space-delete': function(e) {
		e.preventDefault();

		if (confirm(TAPi18n.__('space-edit--delete-space-message'))) {
			Meteor.call('deleteSpace', this._id, function(error) {
				if (error)
					alert(TAPi18n.__('error-message')+error.message);
				else {
					alert(TAPi18n.__('space-edit--delete-space-confirm-message'));
				}
			});
		}
	},
	'click .admin--user-change-password': function(e) {
		e.preventDefault();

		var newPassword = prompt(TAPi18n.__('admin--change-password-message')); // need to be a modal for hiding password
		if (newPassword) {
			Meteor.call('adminSetNewPassword', Meteor.user(), $(e.currentTarget).data('userid'), newPassword, function(error) {
				if (error)
					alert(TAPi18n.__('error-message')+error.message);
				else
					alert(TAPi18n.__('admin--change-password-confirm-message'));
			});
		}
	},
	'click .admin--user-delete': function(e) {
		e.preventDefault();

		var userId = this._id;

		if (confirm(TAPi18n.__('admin--user-delete-message'))) {
			Meteor.call('deleteUser', userId, function(error) {
				if (error)
					alert(TAPi18n.__('error-message')+error.message);
				else {
					console.log("UserId : "+userId)
					Meteor.call('deleteSpaces', userId, function(error) {
						if (error)
							alert(TAPi18n.__('error-message')+error.message);
						else {
							alert(TAPi18n.__('admin--user-delete-confirm-message'));
						}
					});
				}
			});
		}
	}
});


Template.admin.helpers({

	spaces: function() {
		return Spaces.find({},{sort: {submitted: -1}});
	},
	user: function() {
		return Meteor.users.find({},{sort: {createdAt: -1}});
	},
	admin: function() {
		return Roles.userIsInRole(this._id, 'admin');
	},
	isOnline: function() {
		if (this.status.online)
			return true
	},
	beekeeVersion: function() {
		Meteor.call('getBeekeeVersion', function(error, result){
			if (error) {
				Session.set('beekeeVersion',error);
			}
			else {
				Session.set('beekeeVersion',result);
			}
		});
		return Session.get('beekeeVersion');
	},
	raspbianVersion: function() {
		Meteor.call('getRaspbianVersion', function(error, result){
			if (error) {
				Session.set('raspbianVersion',error);
			}
			else {
				Session.set('raspbianVersion',result);
			}
		});
		return Session.get('raspbianVersion');
	},
	boxSerial: function() {
		Meteor.call('getBoxSerial', function(error, result){
			if (error) {
				Session.set('boxSerial',error);
			}
			else {
				Session.set('boxSerial',result);
			}
		});
		return Session.get('boxSerial');
	},
	usedSpace: function() {
		Meteor.call('getUsedSpace', function(error, result){
			if (error) {
				Session.set('usedSpace',error);
			}
			else {
				Session.set('usedSpace',result);
			}
		});
		return Session.get('usedSpace');
	},
	spaceCreatedAt: function() {
		return moment(this.submitted).format("DD/MM/YYYY HH:mm");
	},
	spaceOwner:function() {
		ownerId = this.userId;
		return Meteor.users.findOne(ownerId).emails[0].address;
	},
	userCreatedAt: function() {
		return moment(this.createdAt).format("DD/MM/YYYY HH:mm");
	}
});