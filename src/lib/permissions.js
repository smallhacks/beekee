// check that the userId specified owns the documents
ownsDocument = function(userId, doc) {
  return doc && doc.userId === userId;
}

// check that the userId specified owns the space
ownsSpace = function(userId, post) {
	return post && Spaces.findOne(post.spaceId).userId === userId;
}

// check that the userId specified is admin
isAdmin = function(userId) {
  return Roles.userIsInRole(Meteor.user(), 'admin');
}