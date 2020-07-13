import { Mongo } from 'meteor/mongo';

import { Posts } from './posts.js';
 
export const Authors = new Mongo.Collection('live-authors');

Authors.allow({

	insert: function() {return true},

	remove: function() {return true},

	update: function() {return true}
});

if(Meteor.isServer) {

	Meteor.publish("authors", function(spaceId) {
		return Authors.find({spaceId: spaceId});
	});
}

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