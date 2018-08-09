// ###  Update database


// Check if home posts have order attribute
if (Posts.find({type:"home"}) != 0) {
	if (Posts.find({type:"home", order:{$exists:false}}).count() > 0) {
		console.log('Checking if home posts without "order" attribute exist and updating if so');
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