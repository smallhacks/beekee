Template.lessons.helpers({

	lessonsPosts: function() {
		return Posts.find({},{sort: {submitted: 1}});
	}
});