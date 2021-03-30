// Copyright 2016-2020 UNIVERSITY OF GENEVA (GENEVA, SWITZERLAND)

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