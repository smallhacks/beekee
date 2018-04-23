PostEditController = RouteController.extend({

	waitOn: function () {
		console.log("ici on a : "+this.params._id);
		spaceId = Posts.findOne(this.params._id).spaceId;

		return [
	  		Meteor.subscribe('post', this.params._id),
	  		Meteor.subscribe('tags', spaceId),
	  		Meteor.subscribe('categories', spaceId),
	  		Meteor.subscribe('space', this.params._id),
		]; 
  	},

  	data: function () {
		return {
	  		post: Posts.findOne(this.params._id),
	  		space: Spaces.findOne(spaceId)
		}
 	},

  	action: function () {
  		this.render('postEditHeader', {to: 'layout--header'});
		this.render();
  	},

	fastRender: true
});