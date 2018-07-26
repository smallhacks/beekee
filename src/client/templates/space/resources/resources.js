Template.resources.helpers({

	resourcesPosts: function() {
		return Posts.find({},{sort: {submitted: 1}});
	}
});