Template.lessons.helpers({

	lessonsPosts: function() {
		return Posts.find({spaceId:Session.get('spaceId'), type:"lesson"},{sort: {submitted: 1}});
	}
});