// Copyright 2016-2021 VINCENT WIDMER

// This file is part of Beekee Live.
    
// Beekee Live is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Beekee Live is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
//  along with Beekee Live.  If not, see <https://www.gnu.org/licenses/>.

//**************************************************************************


Template.admin.onRendered(function () {

	$('.modal').on('shown.bs.modal', function (e) {
		  $(this).find('[autofocus]').focus(); // Force autofocus on modal
	});
});


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
	},
	'click .admin--shutdown': function(e, template) {
		e.preventDefault();

		var alert = confirm(TAPi18n.__('index-teacher--shutdown-message'));
		if (alert) {
			Meteor.call('shutdownBox', function(error, result){
				if (error) {
					alert(TAPi18n.__('error-message')+error.message);
				}
				else {
					alert(TAPi18n.__('index-teacher--shutdown-confirm'));
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
	ipAddress: function() {
		Meteor.call('getIP', function(error, result){
			if (error) {
				Session.set('ipAddress',error);
			}
			else {
				Session.set('ipAddress',result);
			}
		});
		var ipAdress = Session.get('ipAddress');
		if (ipAdress =="")
			return "Not connected"
		else
			return ipAdress;
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