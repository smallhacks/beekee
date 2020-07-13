import { Mongo } from 'meteor/mongo';
 
export const Files = new Mongo.Collection('live-files');


Files.allow({

  	insert: function() {return true},

 	remove: function() {return true},

	update: function() {return true}
});

if(Meteor.isServer) {

	Meteor.publish("file", function(fileId) {
	return Files.find({_id:fileId})
});

Meteor.publish("files", function(spaceId) {
	return Files.find({spaceId: spaceId})
});

Meteor.publish("allFiles", function() {
	return Files.find({})
});

	var fs = Npm.require('fs');
	var rimraf = Npm.require('rimraf'); // Package to delete directories
	var uploadDir = Meteor.settings.uploadDir;

	Meteor.methods({

		deleteFile: function(post) {

			if (post.type == 'lesson') // Remove directory (each storline lesson is stored in is own directory)
				rimraf(uploadDir+"/"+post.spaceId+"/"+post.type+"/"+post.fileId, function (err) {console.log(err)});
			else // Remove the file
    			fs.unlinkSync(uploadDir +"/"+post.filePath, function (err) {console.log(err)});
  		}
	})
}