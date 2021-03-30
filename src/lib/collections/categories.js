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


Categories = new Mongo.Collection('categories'); // Store all categories

// TODO : add server-side security

Categories.allow({

	insert: function() {return true},

	remove: function() {return true},

	update: function() {return true}
});


Meteor.methods({

	categoryInsert: function(type, name, spaceId) {
		Categories.insert({type: type, name: name, spaceId: spaceId, nRefs: 0});
	},
	categoryEdit: function(spaceId, type, oldName, newName) {
		var category = Categories.findOne({type: type, name: oldName, spaceId: spaceId});
		Categories.update(category._id, {$set: {name:newName}}, function(error) {
			if (error) {
				console.log("Error when changing category name : "+error.message);
			}
			else {
				Posts.update({spaceId:spaceId, type: type, category: oldName},{$set: {category: newName}}, {multi: true}); // Update all author posts with new name
			}
		});
	},
	categoryDelete: function(type, name, spaceId) {
		var category = Categories.findOne({type: type, name: name, spaceId: spaceId});
		Categories.remove(category._id, function(error) {
			if (error) {
				console.log("Error when deleting category : "+error.message);
			}
			else {
				Posts.update({type: type, spaceId:spaceId, category: name},{$unset: {category:""}}, {multi: true}); // Update all author posts with new name
			}
		});
	}
});