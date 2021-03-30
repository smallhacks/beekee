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


Authors = new Mongo.Collection('authors'); // Store author list

// TODO : add server-side security

Authors.allow({

	insert: function() {return true},

	remove: function() {return true},

	update: function() {return true}
});

Meteor.methods({

	authorInsert: function(name, spaceId) {
		Authors.insert({name: name, spaceId: spaceId, nRefs: 0},function(error) {
			if (error) {
				console.log("Error when inserting author  : "+error.message);
			} else {
				console.log("Author inserted");
			}
		});
	},
	authorEdit: function(spaceId, oldName, newName) {
		var author = Authors.findOne({name: oldName, spaceId: spaceId});
		Authors.update(author._id, {$set: {name:newName}}, function(error) {
			if (error) {
				console.log("Error when changing author name : "+error.message);
			}
			else {
				Posts.update({spaceId:spaceId, author: oldName},{$set: {author: newName}}, {multi: true}); // Update all author posts with new name
			}
		});
	}
});