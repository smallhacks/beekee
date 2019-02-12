SpaceController = RouteController.extend({

	onBeforeAction: function () {

		var spaceId = this.params._id;
		if (!Spaces.findOne(spaceId)) {
			var space = {
				title: this.params._id,
				_id: this.params._id
			};

			Meteor.call('spaceInsert', space, function(error, result) {
				if(error)
					alert(TAPi18n.__('error-message')+error.message);
				else {
					this.next();
				}
			});
		} else
			this.next();		
	},

	waitOn: function () { 
		return [
			Meteor.subscribe("count-all-live-feed", this.params._id),
			Meteor.subscribe("count-all-pinned", this.params._id),
			Meteor.subscribe("count-all-files", this.params._id),
			Meteor.subscribe("count-all-images", this.params._id),
			Meteor.subscribe('space', this.params._id),
			Meteor.subscribe('authors', this.params._id),
			Meteor.subscribe('categories', this.params._id)  
		];
	},

	data: function () {
		var isAdmin = false;
		if (this.params.isadmin == "oSXfn6qej4bAwYpWn")
			isAdmin = true;
		return {
			user: this.params.userUsername,
			isAdmin: isAdmin,
			space: Spaces.findOne(this.params._id),
			posts: Posts.find({spaceId:this.params._id}),
			last: this.params.last
		}
	},

	action: function () {
		this.render();
	},

	fastRender: true
});