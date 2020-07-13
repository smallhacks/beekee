import { Mongo } from 'meteor/mongo';


// Sharing the same Account collection than beekee-live
if (Meteor.isServer) {

	// check that the userId specified is admin
isAdmin = function(userId) {
	console.log("isadmin");
  return Roles.userIsInRole(Meteor.user(), 'admin');
}


// Publish Roles to client
Meteor.publish(null, function () {
  if (this.userId) {
    return Meteor.roleAssignment.find({ 'user._id': this.userId });
  } else {
    this.ready()
  }
});

Meteor.publish(null, function () {
	    return Meteor.roleAssignment.find();

});
}