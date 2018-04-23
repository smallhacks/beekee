Tags = new Mongo.Collection('tags');

// TODO : add server-side security

Tags.allow({

	insert: function() {return true},

	remove: function() {return true},

	update: function() {return true}
});


Meteor.methods({

	tagsInsert: function(postAttributes) {
		postAttributes.tags.forEach(function(tag) {
			var tag = tag.trim();
			if (tag != "") {
				var item = Tags.findOne({name: tag, spaceId: postAttributes.spaceId});
				if (item)
					Tags.update(item, {$inc: {nRefs: 1}});
				else
					Tags.insert({name: tag, spaceId: postAttributes.spaceId, nRefs: 1});
			}
		});
	},
	tagsEdit: function(postAttributes) { // Increment or decrement tags nRefs
		var oldTags = postAttributes.oldTags;
		var newTags = postAttributes.newTags;
		var spaceId = postAttributes.spaceId;

		var intersection = _.intersection(oldTags, newTags);

		var addTags = _.difference(newTags, intersection);

		if (addTags.length > 0) {
			addTags.forEach(function(tag) {
				var tag = tag.trim();
				if (tag != "") {    
					var item = Tags.findOne({spaceId: spaceId, name: tag});
					if (item)
						Tags.update(item, {$inc: {nRefs: 1}});
					else
						Tags.insert({name: tag.trim(), spaceId: spaceId, nRefs: 1});
				}
			});      
		}

		var removeTags = _.difference(oldTags, intersection);

		if (removeTags.length > 0) {
			removeTags.forEach(function(tag) {
				var tag = tag.trim();
				var item = Tags.findOne({spaceId: spaceId, name: tag});
				if (item) {
					if (item.nRefs > 1) {
						Tags.update(item, {$inc: {nRefs: -1}});
					} else {
						Tags.remove(item);
					}
				}
			});      
		}
	}
});