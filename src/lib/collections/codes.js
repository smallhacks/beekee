Codes = new Mongo.Collection('codes'); // Store all space codes

// TODO : add server-side security

Codes.allow({

	insert: function() {return true},

	remove: function() {return true},

	update: function() {return true}
});