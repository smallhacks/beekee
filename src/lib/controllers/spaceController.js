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


SpaceController = RouteController.extend({

	onBeforeAction: function () {
		var spaceId = this.params._id;
		if (Spaces.findOne(spaceId)) {
			if (!Session.get(spaceId)) {
				if (Meteor.userId()) {
					var adminName = Meteor.user().profile.name;
					if (!Authors.findOne({spaceId:spaceId,name:adminName})) {
						Meteor.call('authorInsert', adminName, spaceId, function(error) {
							if (error) {
								console.log(error);
							}
							else {
								Session.setPersistent(spaceId, {author: adminName}); // Persistent to browser refresh
							}
						});
					}
					else {
						Session.setPersistent(spaceId, {author: adminName}); // Persistent to browser refresh
					}
				} else
					Router.go('spaceUsersFirstConnection', {_id: spaceId});
			}
			else {
				if (Meteor.userId()) {
					var adminName = Meteor.user().profile.name;
					if (!Authors.findOne({spaceId:spaceId,name:adminName})) {
						Meteor.call('authorInsert', adminName, spaceId, function(error) {
							if (error) {
								console.log(error);
							}
							else {
								Session.setPersistent(spaceId, {author: adminName}); // Persistent to browser refresh
							}
						});
					}
					else {
						Session.setPersistent(spaceId, {author: adminName}); // Persistent to browser refresh
					}
				}	
			}
		}
		else {
			Router.go('notFound');
		}
		
		this.next();
	},

	waitOn: function () { 
		return [
			Meteor.subscribe("count-all-live-feed", this.params._id),
			Meteor.subscribe("count-all-pinned", this.params._id),
			Meteor.subscribe("count-all-files", this.params._id),
			Meteor.subscribe("count-all-images", this.params._id),
			Meteor.subscribe('space', this.params._id),
			Meteor.subscribe('authors', this.params._id),
			Meteor.subscribe('categories', this.params._id)  
		];
	},

	data: function () {
		return {
			space: Spaces.findOne(this.params._id),
			posts: Posts.find({spaceId:this.params._id}),
			last: this.params.last
		}
	},

	action: function () {
		this.render();
	},

	fastRender: true
});