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