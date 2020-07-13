import { Template } from 'meteor/templating';

import { Spaces } from '../../../api/spaces.js';


import './modules_settings.html';

import '../../headers/back_header.js';

Template.modulesSettings.events({
 
	'click .modules-settings--live-feed': function(e) {
		e.preventDefault();

		if (this.space.liveFeed) {
			Spaces.update(this.space._id, {$set: {liveFeed:false}}, function(error) {
				if (error)
					alert(TAPi18n.__('error-message')+error.message);
			});
		}
		else {				
			Spaces.update(this.space._id, {$set: {liveFeed:true}}, function(error) {
				if (error)
					alert(TAPi18n.__('error-message')+error.message);
			});				
		}
	},
	'click .modules-settings--lessons': function(e) {
		e.preventDefault();

		if (this.space.lessons) {
			Spaces.update(this.space._id, {$set: {lessons:false}}, function(error) {
				if (error)
					alert(TAPi18n.__('error-message')+error.message);
			});
		}
		else {				
			Spaces.update(this.space._id, {$set: {lessons:true}}, function(error) {
				if (error)
					alert(TAPi18n.__('error-message')+error.message);
			});				
		}
	},
	'click .modules-settings--resources': function(e) {
		e.preventDefault();

		if (this.space.resources) {
			Spaces.update(this.space._id, {$set: {resources:false}}, function(error) {
				if (error)
					alert(TAPi18n.__('error-message')+error.message);
			});
		}
		else {				
			Spaces.update(this.space._id, {$set: {resources:true}}, function(error) {
				if (error)
					alert(TAPi18n.__('error-message')+error.message);
			});				
		}
	}
}); 