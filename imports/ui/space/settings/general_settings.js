import { Template } from 'meteor/templating';
import { Spaces } from '../../../api/spaces.js';


import './general_settings.html';

import '../../headers/back_header.js';


Template.generalSettings.events({
 
	'click .general-settings--change-code': function(e) {
		e.preventDefault();

		var currentSpaceId = this.space._id;
		var currentSpaceCode = this.space.spaceCode;

		var newCode = prompt(TAPi18n.__('space-edit--change-code-message')+" :", currentSpaceCode);
		if (newCode && newCode != currentSpaceCode && newCode !="") {
			if (newCode.length < 4 || newCode.length > 8) {
				alert("The code must be at least 3 characters and at most 12");
			}
			else {
				Meteor.call('getSpaceId', newCode, function(error,result) {
					if (error) {
						alert(TAPi18n.__('error-message')+error.message);
					}
					else {
						if (result == null) {
							var spaceProperties = { spaceCode: newCode }
							Spaces.update(currentSpaceId, {$set: spaceProperties}, function(error) {
								if (error)
								{
									alert("ici : "+TAPi18n.__('error-message')+error.message);
								}
								else {
									alert(TAPi18n.__('space-edit--change-code-confirm-message'));
									Meteor.call('updateCode', currentSpaceCode, newCode)
								}
							});
						}
						else {
							alert(TAPi18n.__('space-edit--change-code-already-used-message'));
						}
					}
				});
			}
		}
	},
	'click .general-settings--rename-button': function(e) {
		e.preventDefault();

		var currentSpaceId = this.space._id;
		var currentSpaceName = this.space.title;

		var newName = prompt(TAPi18n.__('space-edit--rename-space-message')+" :", this.space.title);
		if (newName && newName != currentSpaceName && newName !="") {
			if (newName.length < 4 || newName.length > 35) {
				alert("The name must be at least 3 characters and at most 35");
			}
			else {
				var spaceProperties = {
					title: newName
				}
				Spaces.update(currentSpaceId, {$set: spaceProperties}, function(error) {
					if (error)
					{
						alert(TAPi18n.__('error-message')+error.message);
					}
					else {
						alert(TAPi18n.__('space-edit--rename-space-confirm-message')+" : "+newName);
					}
				});
			}
		}
	},
	'click .general-settings--delete-button': function(e) {
		e.preventDefault();

		if (confirm(TAPi18n.__('space-edit--delete-space-message'))) {
			Meteor.call('deleteSpace', this.space._id, function(error) {
				if (error)
					alert(TAPi18n.__('error-message')+error.message);
				else {
					alert(TAPi18n.__('space-edit--delete-space-confirm-message'));
					Router.go('indexTeacher');
				}
			});
		}
	},
	'click .space-edit--activate-reactiveness': function(e) {
		e.preventDefault();

		if (Session.get('isReactive'))
			Session.set('isReactive',false);
		else
			Session.set('isReactive',true);
	},
	'click .space-edit--activate-create-user': function(e) {
		e.preventDefault();

		if (this.space.createUserAllowed)
			Spaces.update(this.space._id, {$set: {createUserAllowed:false}}, function(error) {
				if (error)
					alert(TAPi18n.__('error-message')+error.message);
			});
		else
			Spaces.update(this.space._id, {$set: {createUserAllowed:true}}, function(error) {
				if (error)
					alert(TAPi18n.__('error-message')+error.message);
			});
	},
	'change .space-edit--select-permissions': function(event) {
		event.preventDefault();
		Spaces.update(this.space._id, {$set: {postEditPermissions:event.target.value}}, function(error) {
			if (error)
					alert(TAPi18n.__('error-message')+error.message);
		});
	}, 
	'click .space-edit--change-password': function(e) { // Change user password
		e.preventDefault();

		var oldPassword = prompt(TAPi18n.__('space-edit--change-password-old-message'));
		if (oldPassword) 
			var newPassword = prompt(TAPi18n.__('space-edit--change-password-new-message'));
		if (newPassword)
			Accounts.changePassword(oldPassword, newPassword, function(error) {
				if (error)
					alert(TAPi18n.__('error-message')+error.message);
				else
					alert(TAPi18n.__('space-edit--change-password-confirm-message'));
			});
	},
	'click .space-edit--sync': function(e, template) {
		e.preventDefault();
		Session.set('isSyncing',true);
		var serverOwnerEmail = prompt(TAPi18n.__('space-edit--sync-login-message'));

		if (serverOwnerEmail) {
			Meteor.call('sendSpace', {spaceId: this.space._id, serverOwner: serverOwnerEmail}, function(error,result) {
				if (error)
					alert(TAPi18n.__('space-edit--sync-error-message'));
			});
		}
	}
}); 


Template.generalSettings.helpers({

	serverIP: function() {
		Meteor.call('getIP', function(error, result){
			if (error) {
				Session.set('serverIP',TAPi18n.__('space-edit--no-ip')); // Is Session really usefull here ?
			} else {
				if (result != "")
					Session.set('serverIP',result);
				else
					Session.set('serverIP',TAPi18n.__('space-edit--not-connected'));
			}
		});
		return Session.get('serverIP');
	},
	isSyncing: function() {
		return Session.get('isSyncing');
	},
	isBox: function() {
		return (Meteor.settings.public.isBox === "true")
	},
	isReactive: function() {
		return Session.get('isReactive')
	},
	createUserIsAllowed: function() {
		return this.space.createUserAllowed
	},
	permissionIsSelected: function(value) {
		return (this.space.postEditPermissions === value)
	}
});
