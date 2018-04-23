Meteor.publish('space', function(spaceId) {
	check(spaceId, String);
	return Spaces.find({_id: spaceId});	
});

Meteor.publish('allSpaces', function() {
	return Spaces.find({});
});

Meteor.publish('ownSpaces', function(userId) {
	return Spaces.find({userId:userId});
});

Meteor.publish('spacesVisited', function(spacesId) {
	return Spaces.find({ "_id": { "$in": spacesId } });
});

Meteor.publish('post', function(postId) {
	check(postId, String);
	return Posts.find({_id: postId});
});

Meteor.publish('posts', function(filters,skip,limit) {
	return Posts.find(filters, {sort: {submitted: 1},skip:skip,limit:limit});
});

Meteor.publish("file", function(fileId) {
	return Files.find({fileId:fileId})
});

Meteor.publish("files", function(spaceId) {
	return Files.find({spaceId: spaceId})
});

Meteor.publish("authors", function(spaceId) {
	return Authors.find({spaceId: spaceId});
});

Meteor.publish("categories", function(spaceId) {
	return Categories.find({spaceId: spaceId});
});

Meteor.publish("tags", function(spaceId) {
	return Tags.find({spaceId: spaceId});
});

Meteor.publish('allUsers', function() {
	return Meteor.users.find();
 })

// Publish the current size of a collection without subscribe to the collection
Meteor.publish("count-all-posts", function (spaceId) {
	var self = this;
	var count = 0;
	var initializing = true;

	var handle = Posts.find({spaceId: spaceId}).observeChanges({
		added: function (doc, idx) {
			count++;
			if (!initializing) {
				self.changed("counts", spaceId, {count: count});  // "counts" is the published collection name
			}
		},
		removed: function (doc, idx) {
			count--;
			self.changed("counts", spaceId, {count: count});  // Same published collection, "counts"
		}
	});

	initializing = false;

	// publish the initial count. `observeChanges` guaranteed not to return
	// until the initial set of `added` callbacks have run, so the `count`
	// variable is up to date.
	self.added("counts", spaceId, {count: count});

	// and signal that the initial document set is now available on the client
	self.ready();

	// turn off observe when client unsubscribes
	self.onStop(function () {
		handle.stop();
	});
});


Meteor.publish("count-all-pinned", function (spaceId) {
	var self = this;
	var pinnedCounts = 0;
	var initializing = true;

	var handle = Posts.find({spaceId: spaceId, pinned:true}).observeChanges({
		added: function (doc, idx) {
			pinnedCounts++;
			if (!initializing) {
				self.changed("pinnedCounts", spaceId, {count: pinnedCounts});  // "counts" is the published collection name
			}
		},
		removed: function (doc, idx) {
			pinnedCounts--;
			self.changed("pinnedCounts", spaceId, {count: pinnedCounts});  // Same published collection, "counts"
		}
	});

	initializing = false;

	// publish the initial count. `observeChanges` guaranteed not to return
	// until the initial set of `added` callbacks have run, so the `count`
	// variable is up to date.
	self.added("pinnedCounts", spaceId, {count: pinnedCounts});

	// and signal that the initial document set is now available on the client
	self.ready();

	// turn off observe when client unsubscribes
	self.onStop(function () {
		handle.stop();
	});
});


Meteor.publish("count-all-files", function (spaceId) {
	var self = this;
	var filesCounts = 0;
	var initializing = true;

	//var handle = Posts.find({spaceId: spaceId, $or : [{fileExt:"txt"},{fileExt:"rtf"},{fileExt:"pdf"},{fileExt:"zip"}]}).observeChanges({

	var handle = Posts.find({spaceId: spaceId, $and : [{fileId:{$exists:true} },{fileId:{$ne:false} },{fileExt:{$nin : ["jpg","jpeg","png","gif"]}}]}).observeChanges({
		added: function (doc, idx) {
			filesCounts++;
			if (!initializing) {
				self.changed("filesCounts", spaceId, {count: filesCounts});  // "counts" is the published collection name
			}
		},
		removed: function (doc, idx) {
			filesCounts--;
			self.changed("filesCounts", spaceId, {count: filesCounts});  // Same published collection, "counts"
		}
	});

	initializing = false;

	// publish the initial count. `observeChanges` guaranteed not to return
	// until the initial set of `added` callbacks have run, so the `count`
	// variable is up to date.
	self.added("filesCounts", spaceId, {count: filesCounts});

	// and signal that the initial document set is now available on the client
	self.ready();

	// turn off observe when client unsubscribes
	self.onStop(function () {
		handle.stop();
	});
});


Meteor.publish("count-all-images", function (spaceId) {
	var self = this;
	var imagesCounts = 0;
	var initializing = true;

	var handle = Posts.find({spaceId: spaceId, $or : [{fileExt:"jpg"},{fileExt:"jpeg"},{fileExt:"gif"},{fileExt:"png"}]}).observeChanges({
		added: function (doc, idx) {
			imagesCounts++;
			if (!initializing) {
				self.changed("imagesCounts", spaceId, {count: imagesCounts});  // "counts" is the published collection name
			}
		},
		removed: function (doc, idx) {
			imagesCounts--;
			self.changed("imagesCounts", spaceId, {count: imagesCounts});  // Same published collection, "counts"
		}
	});

	initializing = false;

	// publish the initial count. `observeChanges` guaranteed not to return
	// until the initial set of `added` callbacks have run, so the `count`
	// variable is up to date.
	self.added("imagesCounts", spaceId, {count: imagesCounts});

	// and signal that the initial document set is now available on the client
	self.ready();

	// turn off observe when client unsubscribes
	self.onStop(function () {
		handle.stop();
	});
});