import { Mongo } from 'meteor/mongo';
 
export const Codes = new Mongo.Collection('live-codes');

Codes.allow({

	insert: function() {return true},

	remove: function() {return true},

	update: function() {return true}
});