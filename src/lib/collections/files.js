Files = new Mongo.Collection('files'); // Store all files

// TODO : add server-side security

Files.allow({

  	insert: function() {return true},

 	remove: function() {return true},

	update: function() {return true}
});