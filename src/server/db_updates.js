// Copyright 2016-2021 VINCENT WIDMER

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


// ###  Update database


// As of v1.1
// Check if home posts have order attribute
if (Posts.find({type:"home"}) != 0) {
	console.log('Checking if home posts without "order" attribute exist and updating if so');
	if (Posts.find({type:"home", order:{$exists:false}}).count() > 0) {
		var spaces = Spaces.find({}).fetch();
		for (i=0; i<spaces.length; i++) {
			var posts = Posts.find({spaceId:spaces[i]._id,type:"home"}).fetch();
			for (k=0; k<posts.length; k++) {
				Posts.update({_id:posts[k]._id},{$set:{"order":k}});
				console.log("Updating post : "+posts[k]._id);
			}
		}
	}
	Posts.update({type:"home", order:{$exists:false}},{$set:{"order":0}}); // If posts are not linked to a spaceId
}


// As of v1.2
// Check if categories have type attribute
console.log('Checking if categories without "type" attribute exist and updating if so');
if (Categories.find({type:{$exists:false}}).count() > 0) {
	console.log('There are categories without "type" attribute');
	Categories.update({type:{$exists:false}},{$set:{"type":"liveFeed"}}, function(err,res) { // Before v1.2, categories was only available for liveFeed
		if (err) {
			console.log('Error when updating categories without "type" attribute : '+error.message);
		}
		else {
			console.log('All categories without "order" attribute have been updated.');
			console.log(res);
		}
	});
}


// As of v1.25
// Check if spaces have permissions attributes
console.log('Checking if spaces without "permissions" attribute exist and updating if so');
if (Spaces.find({"permissions":{$exists:false}}).count() > 0) {
	console.log('There are spaces without "permissions" attribute');
	Spaces.update({"permissions":{$exists:false}},{$set:{"permissions":{"public":false,"liveFeedAddPost":true,"liveFeedAddCategory":false}}}, function(err,res) {
		if (err) {
			console.log('Error when updating spaces without "permissions" attribute : '+error.message);
		}
		else {
			console.log('All spaces without "permissions" attribute have been updated.');
			console.log(res);
		}
	});
} else {
	//Check if spaces have permissions.liveFeedAddPost attributes
	console.log('Checking if spaces without "permissions.liveFeedAddPost" attribute exist and updating if so');
	if (Spaces.find({"permissions.liveFeedAddPost":{$exists:false}}).count() > 0) {
		console.log('There are spaces without "permissions.liveFeedAddPost" attribute');
		Spaces.update({"permissions.liveFeedAddPost":{$exists:false}},{$set:{"permissions.liveFeedAddPost":"own"}}, function(err,res) {
			if (err) {
				console.log('Error when updating spaces without "permissions.liveFeedAddPost" attribute : '+error.message);
			}
			else {
				console.log('All spaces without "permissions.liveFeedAddPost" attribute have been updated.');
				console.log(res);
			}
		});
	}
	//Check if spaces have permissions.liveFeedAddCategory attributes
	console.log('Checking if spaces without "permissions.liveFeedAddCategory" attribute exist and updating if so');
	if (Spaces.find({"permissions.liveFeedAddCategory":{$exists:false}}).count() > 0) {
		console.log('There are spaces without "permissions.liveFeedAddCategory" attribute');
		Spaces.update({"permissions.liveFeedAddCategory":{$exists:false}},{$set:{"permissions.liveFeedAddCategory":false}}, function(err,res) {
			if (err) {
				console.log('Error when updating spaces without "permissions.liveFeedAddCategory" attribute : '+error.message);
			}
			else {
				console.log('All spaces without "permissions.liveFeedAddCategory" attribute have been updated:');
				console.log(res);
			}
		});
	}
}