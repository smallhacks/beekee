Files = new Mongo.Collection('files'); // Store all files

// TODO : add server-side security

Files.allow({

  	insert: function() {return true},

 	remove: function() {return true},

	update: function() {return true}
});

if(Meteor.isServer) {

	var fs = Npm.require('fs');
	var rimraf = Npm.require('rimraf'); // Package to delete directories
	var uploadDir = process.env.PWD + '/.uploads';

	Meteor.methods({

		deleteFile: function(post) {

			if (post.type == 'lesson') // Remove directory (each storline lesson is stored in is own directory)
				rimraf(uploadDir+"/"+post.spaceId+"/"+post.type+"/"+post.fileId, function (err) {console.log(err)});
			else // Remove the file
    			fs.unlinkSync(uploadDir +"/"+post.filePath, function (err) {console.log(err)});
  		}
	})
}