Authors = new Mongo.Collection('authors'); // Store author list

// TODO : add server-side security

Authors.allow({

	insert: function() {return true},

	remove: function() {return true},

	update: function() {return true}
});

Meteor.methods({

	authorInsert: function(name, email, spaceId) {
		Authors.insert({name: name, email: email, spaceId: spaceId, nRefs: 0},function(error) {
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