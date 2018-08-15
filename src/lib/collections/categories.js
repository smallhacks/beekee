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