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