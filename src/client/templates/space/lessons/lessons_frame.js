Template.lessonsFrame.helpers({

	lessonURL: function() {
		return '../../upload/'+this.post.spaceId+'/lesson/'+this.post.fileId+'/'+escape(this.post.fileName)+'/story_html5.html';
	}
});