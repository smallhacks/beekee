import { Template } from 'meteor/templating';

import { Spaces } from '../../../api/spaces.js';


import './permissions_settings.html';

import '../../headers/back_header.js';


Template.permissionsSettings.events({
 
 	'click .permissions-settings--public': function(e) {
		e.preventDefault();
	
		if (this.space.permissions)
			if (this.space.permissions.public) {
				Spaces.update(this.space._id, {$set: {"permissions.public":false}}, function(error) {
					if (error)
						alert(TAPi18n.__('error-message')+error.message);
				});
			}
			else {
				Spaces.update(this.space._id, {$set: {"permissions.public":true}}, function(error) {
					if (error)
						alert(TAPi18n.__('error-message')+error.message);
				});				
			}
		else
			Spaces.update(this.space._id, {$set: {"permissions.public":true}}, function(error) {
				if (error)
					alert(TAPi18n.__('error-message')+error.message);
			});
	},
	'click .permissions-settings--liveFeedAddCategory': function(e) {
		e.preventDefault();
	
		if (this.space.permissions)
			if (this.space.permissions.liveFeedAddCategory) {
				Spaces.update(this.space._id, {$set: {"permissions.liveFeedAddCategory":false}}, function(error) {
					if (error)
						alert(TAPi18n.__('error-message')+error.message);
				});
			}
			else {
				Spaces.update(this.space._id, {$set: {"permissions.liveFeedAddCategory":true}}, function(error) {
					if (error)
						alert(TAPi18n.__('error-message')+error.message);
				});				
			}
		else
			Spaces.update(this.space._id, {$set: {"permissions.liveFeedAddCategory":true}}, function(error) {
				if (error)
					alert(TAPi18n.__('error-message')+error.message);
			});
	},
	'click .permissions-settings--liveFeedAddPost': function(e) {
		e.preventDefault();
	
		if (this.space.permissions)
			if (this.space.permissions.liveFeedAddPost) {
				Spaces.update(this.space._id, {$set: {"permissions.liveFeedAddPost":false}}, function(error) {
					if (error)
						alert(TAPi18n.__('error-message')+error.message);
				});
			}
			else {
				Spaces.update(this.space._id, {$set: {"permissions.liveFeedAddPost":true}}, function(error) {
					if (error)
						alert(TAPi18n.__('error-message')+error.message);
				});				
			}
		else
			Spaces.update(this.space._id, {$set: {"permissions.liveFeedAddPost":true}}, function(error) {
				if (error)
					alert(TAPi18n.__('error-message')+error.message);
			});
	}
}); 