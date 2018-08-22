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
	Categories.update({type:{$exists:false}},{$set:{"type":"liveFeed"}}, function(err) { // Before v1.2, categories was only available for liveFeed
		if (err) {
			console.log('Error when updating categories without "type" attribute : '+error.message);
		}
		else {
			console.log('All categories without "order" attribute have been updated.');
		}
	});
}


// As of v1.25
// Check if spaces have permissions attributes
console.log('Checking if spaces without "permissions" attribute exist and updating if so');
if (Spaces.find({"permissions":{$exists:false}}).count() > 0) {
	console.log('There are spaces without "permissions" attribute');
	Spaces.update({"permissions":{$exists:false}},{$set:{"permissions":{"public":false,"liveFeedAddPost":true}}}, function(err) {
		if (err) {
			console.log('Error when updating spaces without "permissions" attribute : '+error.message);
		}
		else {
			console.log('All spaces without "permissions" attribute have been updated.');
		}
	});
} else {
	//Check if spaces have permissions.liveFeedAddPost attributes
	console.log('Checking if spaces without "permissions.liveFeedAddPost" attribute exist and updating if so');
	if (Spaces.find({"permissions.liveFeedAddPost":{$exists:false}}).count() > 0) {
		console.log('There are spaces without "permissions.liveFeedAddPost" attribute');
		Spaces.update({"permissions.liveFeedAddPost":{$exists:false}},{$set:{"permissions":{"liveFeedAddPost":"own"}}}, function(err) {
			if (err) {
				console.log('Error when updating spaces without "permissions.liveFeedAddPost" attribute : '+error.message);
			}
			else {
				console.log('All spaces without "permissions.liveFeedAddPost" attribute have been updated.');
			}
		});
	}
}