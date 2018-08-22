Template.liveFeedPost.onCreated(function() {
	imageExtensions = ["jpg","jpeg","png","gif"];
});

Template.liveFeedPost.onRendered(function() {

	$('.live-feed-post--add-comment-textarea').autosize(); // Textarea autosize

	$('#liveFeedPostEdit').on('hide.bs.modal', function (e) {
		Session.set('fileId', false);
		Session.set('fileName', false);
		Session.set('fileExt', false);
		Session.set('filePath', false);
	})

	$('.life-feed-post--image-wrapper').imagesLoaded(function() { // Show image in a lightbox with magnificPopup plugin
		$('.life-feed-post--image-link').magnificPopup({
			type:'image',
			closeOnContentClick:true,
			closeOnBgClick: true,
		});
	});
});


Template.liveFeedPost.events({

	'click .live-feed-post--edit': function(e) {
		e.preventDefault();
		
		var postId = this._id;
		Session.set('postToEdit',postId);
		//Session.set('fileId', false);
		if (Posts.findOne(postId).fileId) {// If image already exist, set fileId + fileExt in session
			Session.set('fileId', Posts.findOne(postId).fileId);
			Session.set('fileName', Posts.findOne(postId).fileName);
			Session.set('fileExt', Posts.findOne(postId).fileExt);
			Session.set('filePath', Posts.findOne(postId).filePath);
		}
		$('#liveFeedPostEdit').modal({show:true,backdrop:'static'});

	},
	'click .live-feed-post--delete': function(e) {
		e.preventDefault();
		
		var postId = this._id;
		Session.set('postToDelete',postId);
		$('#liveFeedPostDelete').modal('show');
	},
	'keypress .live-feed-post--add-comment-textarea': function (e, template) {
		if (e.which === 13) {
			e.preventDefault();
			var currentPostId = this._id;
			var comment = $(e.target).val();
			var author = Session.get(Template.parentData(1).space._id).author; 
			if (comment != "") {
				Posts.update(currentPostId, {$push: {comments: {id:Random.id(),author: author, submitted:Date.now(),text:comment}}});
				$(e.target).val('');
			}
		}
	},
	'click .live-feed-post--add-like': function(e) {
		e.preventDefault();

		var currentPostId = this._id;
		var author = Session.get(Template.parentData(1).space._id).author; 
		Posts.update(currentPostId, {$push: {likes: author}});
	}, 
	'click .live-feed-post--remove-like': function(e) {
		e.preventDefault();

		var currentPostId = this._id;
		var author = Session.get(Template.parentData(1).space._id).author; 
		Posts.update(currentPostId, {$pull: {likes: author}});
	}, 
	'click .live-feed-post--comment-add-like': function(e) {
		e.preventDefault();

		var currentPostId = $(e.target).data('postid');
		var currentCommentId = this.id;
		var author = Session.get(Template.parentData(1).space._id).author; 
		console.log("currentPostId : "+currentPostId);
				console.log("currentCommentId : "+currentCommentId);
		console.log("author : "+author);

		Meteor.call('addLikeComment',{currentPostId:currentPostId,currentCommentId:currentCommentId,author,author});
	}, 
	'click .live-feed-post--comment-remove-like': function(e) {
		e.preventDefault();

		var currentPostId = $(e.target).data('postid');
		var currentCommentId = this.id;
		var author = Session.get(Template.parentData(1).space._id).author; 
		Meteor.call('removeLikeComment',{currentPostId:currentPostId,currentCommentId:currentCommentId,author,author});
	}
});


Template.liveFeedPost.helpers({

	ownPost:function() {
		if (Session.get(Template.parentData().space._id).author === this.author || Template.parentData().space.userId === Meteor.userId() || Roles.userIsInRole(Meteor.userId(), ['admin']) === true)
			return true
		else
			return false
	},
	ownComment: function() {
		if (Session.get(Template.parentData(2).space._id).author === this.author || Template.parentData(2).space.userId === Meteor.userId() || Roles.userIsInRole(Meteor.userId(), ['admin']) === true) {
			return true
		}
		else
			return false
	},
	image: function() {
		if (this.fileId && $.inArray(this.fileExt, imageExtensions) != -1)
			return this.fileId
	},
	filePath: function() {
		return escape(this.filePath);
	},
	likes: function() {
		if (this.likes)
			return this.likes.length;
	},
	likesWithoutMe: function() {
		if (this.likes)
			return this.likes.length-1;
	},
	likeAlready: function() { // Check if user already like the post
		var author = Session.get(Template.parentData(1).space._id).author; 
		if ($.inArray(author,this.likes) != -1)
			return true
	},
	othersLikes: function() {
		if (this.likes)
			if (this.likes.length > 1)
				return true;
	},
	likesComment: function() {
		if (this.likes)
			return this.likes.length;
	},
	likeAlreadyComment: function() {
		var author = Session.get(Template.parentData(2).space._id).author; 
		console.log("likes : "+this.likes);
		if ($.inArray(author,this.likes) != -1)
			return true;
	},
	othersLikesComment: function() {
		if (this.likes)
			if (this.likes.length > 1)
				return true;
	},
	likesWithoutMeComment: function() {
		if (this.likes)
			return this.likes.length-1;
	} 
});