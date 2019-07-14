Posts = new Mongo.Collection('posts');

// TODO : add server-side security

Posts.allow({
	insert: function() {return true;},

	remove: function(userId, post) {return ownsSpace(userId, post) || isAdmin(userId); },

	update: function() {return true; }
});

if(Meteor.isClient) {
	Counts = new Mongo.Collection("counts"); // Store post count of a space ; Allow to count them without subscribe to all posts (optimization)
	PinnedCounts = new Mongo.Collection("pinnedCounts");
	FilesCounts = new Mongo.Collection("filesCounts");
	ImagesCounts = new Mongo.Collection("imagesCounts");
	LiveFeedCounts = new Mongo.Collection("liveFeedCounts");
	LiveFeedValidatedCounts = new Mongo.Collection("liveFeedValidatedCounts");
}

if(Meteor.isServer) {



	Posts.before.insert(function (userId, doc) {
		// change modified date
		Spaces.update(doc.spaceId, {$set: {modified: Date.now()}});
		doc.version =  1;
		//doc.modified = Date.now();
		/*
		var versionning = {};
		_.extend(versionning, doc, {modifiedBy: userId});
		Meteor.call('addPostVersion', versionning);
		*/
	});


	// Copy post in postVersion before updated
	// TODO : refactoring
	Posts.before.update(function (userId, doc, fieldNames, modifier, options) {



		// var versionning = {};
		// _.extend(versionning, doc, {modifiedBy: userId});
		// Meteor.call('addPostVersion', versionning);

		// var newInc = doc.version+1;
		// if (!modifier.$set) modifier.$set = {};
		// modifier.$set.version = newInc;
		// modifier.$set.modified = Date.now();
	});


	Posts.after.remove(function (userId, doc) {

		// var deletionTime = Date.now();

		// Meteor.call('tagsEdit', {spaceId: doc.spaceId, newTags: [], oldTags: doc.tags}, function(error) { // Decrement tags nRefs
		// 	if (error) {
		// 		throwError(error.reason);
		// 	}
 	// 	});

		// var file = Files.findOne({'metadata.postId': doc.fileId}); // Remove file
		// if (file){
		// 	 // TODO : remove file (not only from collection)
		// 	Files.remove(file._id);
		// }

		// Delete the file if exists
		var fileId = doc.fileId;
		var fileExt = doc.fileExt;
		if (fileId) {
			Files.remove({fileId:fileId});
			Meteor.call('deleteFile',doc);
		}

		// Delete the thumb if exists
		var thumbPath = doc.thumbPath;
		if (thumbPath) {
			Meteor.call('deleteThumb',thumbPath);
		}

		if (doc.type == 'home') { // Update post order
			var post = doc;

			var postsDown = Posts.find({spaceId:doc.spaceId, type:'home', order:{$gt:post.order}}).fetch();

			for (var i=0; i<postsDown.length; i++) {
				console.log("id : "+postsDown[i]._id);
				var currentPost = postsDown[i];
				Posts.update({_id:currentPost._id},{$set:{order:currentPost.order-1}});
			}
		}

		if (doc.type == 'liveFeed') {
			var author = Authors.findOne({spaceId: doc.spaceId, name: doc.author});
			Authors.update(author._id, {$inc: {nRefs: -1}}); // Decrement author nRefs

			if (doc.category) {
				var category = Categories.findOne({spaceId: doc.spaceId, type:"liveFeed", name: doc.category});
				if (category)
					Categories.update(category._id, {$inc: {nRefs: -1}}); // Decrement category nRefs
			}
		}

		if (doc.type == 'resource') {
			if (doc.category) {
				var category = Categories.findOne({spaceId: doc.spaceId, type:"resource", name: doc.category});
				if (category)
					Categories.update(category._id, {$inc: {nRefs: -1}}); // Decrement category nRefs
			}
		}
		// // Add post to posts versions
		// // TODO : refactoring
		// var space = Spaces.findOne(doc.spaceId);
		// // var oldPosts = [];
		// // if (space.oldPosts !== undefined) {
		// // 	oldPosts = space.oldPosts;
		// // }
		// // oldPosts.push(doc._id);
		// //Spaces.update(doc.spaceId, {$set: {oldPosts: oldPosts, modified: Date.now()}});
		// Spaces.update(doc.spaceId, {$set: {modified: Date.now()}});

		// doc.version =  doc.version++;
		// doc.modified = Date.now();
		// var versionning = {};
		// _.extend(versionning, doc, {modifiedBy: userId, last: true});
		// Meteor.call('addPostVersion', versionning);
	});
}


Meteor.methods({

	addLikeComment: function(data) {
		Posts.update({_id:data.currentPostId,"comments.id":data.currentCommentId}, {$push: {"comments.$.likes": data.author}});
	},
	removeLikeComment: function(data) {
		Posts.update({_id:data.currentPostId,"comments.id":data.currentCommentId}, {$pull: {"comments.$.likes": data.author}});
	},
	homePostInsert: function(postAttributes) {
		check(postAttributes.spaceId, String);

		//if (Meteor.settings.public)
			//var postFromCloud = !(Meteor.settings.public.isBox === "true"); // Set where post is submitted (box or cloud)

		post = _.extend(postAttributes, {
			submitted: Date.now(),
			order: Posts.find({spaceId: postAttributes.spaceId, type: postAttributes.type}).count(),
			//nb: Posts.find({spaceId: postAttributes.spaceId}).count() + 1,
			//pinned : false,
		});

		var space = Spaces.findOne(postAttributes.spaceId);
		post._id = Posts.insert(post);		
		return post._id;
	},
	postInsert: function(postAttributes) {
		check(postAttributes.spaceId, String);

		//var postFromCloud = !(Meteor.settings.public.isBox === "true"); // Set where post is submitted (box or cloud)

		var space = Spaces.findOne(postAttributes.spaceId);

		var published = true;
		if (space.permissions.needValidation)
			published = false;

		item = Authors.findOne({spaceId: postAttributes.spaceId, name: postAttributes.author});
		Authors.update(item, {$inc: {nRefs: 1}});
		post = _.extend(postAttributes, {
			authorId: Authors.findOne({spaceId: postAttributes.spaceId, name: postAttributes.author})._id,
			submitted: Date.now(),
			nb: Posts.find({spaceId: postAttributes.spaceId}).count() + 1,
			pinned: false,
			published: published
			// postFromCloud: postFromCloud // Workaround bug sync
		});

		// Get client IP address
		if (Meteor.isServer)
			post = _.extend(postAttributes, {clientIP: this.connection.clientAddress});

		category = Categories.findOne({spaceId: postAttributes.spaceId, name: postAttributes.category}); // Increment category nRefs
		Categories.update(category, {$inc: {nRefs: 1}});

		post._id = Posts.insert(post);

		if (space.mailNotification == true) {

			var spaceOwner = Meteor.users.findOne(space.userId);
			var ownerMail = spaceOwner.emails[0].address;

			Meteor.call('sendEmail', // Send an e-mail to user
	            ownerMail,
	            'vincent.widmer@beekee.ch',
	            TAPi18n.__("post-submit--mail-notification-subject"),
	            '<h3>Une nouvelle photo a été postée sur Beekee</h3><img style="width:150px" src="https://bioscope.beekee.ch/upload'+postAttributes.filePath+'" /><p><b>'+postAttributes.author+'</b></p><p>'+postAttributes.body+'</p>'
	            //TAPi18n.__("post-submit--mail-notification-content",{author:postAttributes.author,url:"https://bioscope.beekee.ch/space/"+postAttributes.spaceId})
	        );	
	     }

		return post._id;
	}
});