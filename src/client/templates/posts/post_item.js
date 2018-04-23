Template.postItem.onRendered(function() {

	$('.post-item--add-comment-textarea').autosize(); // Textarea autosize

	if (!Session.get(Template.parentData(1).space._id)) // Set default author
		Session.set(Template.parentData(1).space._id, {author: 'Invité'});    

	$('.post-item--image-wrapper').imagesLoaded(function() { // Show image in a lightbox with magnificPopup plugin
		$('.post-item--image-link').magnificPopup({
			type:'image',
			closeOnContentClick:true,
			closeOnBgClick: true,
			// callbacks: {
	  //   		open: function() {
	  //     		// Will fire when this exact popup is opened
	  //     		// this - is Magnific Popup object
	  //  	 		},
	  //   		close: function() {

	  //   		// reset form	
	  //   		$(".post-submit--textarea").val('');
	  //   		$(".post-submit--select-categories").val('');

			// 	if (Session.get("fileId")) {
			// 		delete Session.keys["fileId"]; // Clear fileId session
			// 	    Session.set("fileId",''); // needed to set to null to get it work, but don't know why...
			// 	}

			// 	if (Session.get("fileExt")) 
			// 		delete Session.keys["fileExt"]; // Clear fileExt session
			// 	    Session.set("fileExt",''); // needed to set to null to get it work, but don't know why...
	  //   		}
   //  		}
		});
	});

	$('.post-item--text').linkify(); // Detect URLs and create links
	$('.post-item--comment-text').linkify();

		
    // $.contextMenu({
    //     selector: '.context-menu-'+this.data._id, 
    //     trigger: 'left',
    //     callback: function(key, options) {
    //         var m = "clicked: " + key + $(this).data('postid');
    //         window.console && console.log(m) || alert(m); 
    //     },
    //     items: {
    //         "edit": {name: testvar, icon: "fa-star"},
    //         "cut": {name: "Cut", icon: "cut"},
    //         "copy": {name: "Copy", icon: "copy"},
    //         "paste": {name: "Paste", icon: "paste"},
    //         "delete": {name: "Delete", icon: "delete"},
    //         "sep1": "---------",
    //         "quit": {name: "Quit", icon: function($element, key, item){ return 'context-menu-icon context-menu-icon-quit'; }}
    //     }
    // });



	var spaceOwner = Template.parentData(1).space.userId;
	var spaceId = Template.parentData(1).space._id;
	var postOwner = this.data.author;


	function isSpaceOwner() {
		var userId = Meteor.userId();
		var isAdmin = Roles.userIsInRole(Meteor.userId(), ['admin']);

		if (userId)
			if (spaceOwner === userId)
				return true;
		else if (isAdmin)
			if (isAdmin === true)
				return true;
		else
			return false;
       }


     $.contextMenu({
        selector: '.context-menu-'+this.data._id, 
        trigger: 'left',
        build: function($trigger, e) {


        	var postId = $(e.currentTarget).data('postid');
        	var contextualItems = {};
        	var permissions = Spaces.findOne(spaceId).postEditPermissions;
        	console.log("rights : "+Spaces.findOne(spaceId).postEditPermissions);

        	if (isSpaceOwner()) {
	        	var textPinned;
	        	if ($(e.currentTarget).data('ispinned')) {
	        		textPinned = TAPi18n.__('post-item--remove-pin');
	        		iconPinned ="fa-thumb-tack strikethrough";
	        	}
	        	else {
	        		textPinned = TAPi18n.__('post-item--add-pin');
	        		iconPinned = "fa-thumb-tack";
	        	}
        		$.extend(contextualItems, {"pin":{name:textPinned, icon:iconPinned}});
        	}

        	var textFavorite;
        	if ($(e.currentTarget).data('isfavorite')) {
        		var isFavorite = true;
        		textFavorite = TAPi18n.__('post-item--remove-favorites');
        		iconFavorite = "fa-star strikethrough";
        	}
        	else {
        		textFavorite = TAPi18n.__('post-item--add-favorites');
        		iconFavorite = "fa-star";
        	}
        	$.extend(contextualItems, {"favorite":{name:textFavorite, icon:iconFavorite}});

        	if (isSpaceOwner() || postOwner == Session.get(spaceId).author && permissions === "own" || permissions === "all") {
        		$.extend(contextualItems, {"edit":{name:TAPi18n.__('post-item--edit'), icon:"fa-pencil"}});
        		$.extend(contextualItems, {"delete":{name:TAPi18n.__('post-item--delete'), icon:"fa-trash-o"}});
        	}

        	//if (Template.parentData().space.postEditPermissions === "all" || (Template.parentData().space.postEditPermissions === "own" && Session.get(Template.parentData().space._id).author === this.author) || Template.parentData().space.userId === Meteor.userId() || Roles.userIsInRole(Meteor.userId(), ['admin']) === true)

 
            // this callback is executed every time the menu is to be shown
            // its results are destroyed every time the menu is hidden
            // e is the original contextmenu event, containing e.pageX and e.pageY (amongst other data)
            return {
                callback: function(key, options) {
                	if (key == "pin") {
                		var doc = Posts.findOne(postId);
						Posts.update(postId, {$set: {pinned: !doc.pinned}});
                	}
                	else if (key == "favorite") {
						
						var session = Session.get(spaceId);

                		if (isFavorite) {
							if (session.favorites) {
								session.favorites = $.grep(session.favorites, function(value) { // Remove currentPostID from favorites array
			  						return value != postId;
								});
							}
						}
						else {
							if (session.favorites)
								session.favorites.push(postId);
							else {
								session.favorites = [];
								session.favorites.push(postId);
							}
						}
						Session.setPersistent(spaceId, session); // Persistent to browser refresh
					}
					else if (key == "edit") {

						$('.space-page--post-edit').html(''); // delete old content
						Blaze.renderWithData(Template.postEdit, {_id: postId}, $('#space-page--post-edit-'+postId)[0]);

						$.magnificPopup.open({
							type:'inline',
							closeOnContentClick: false,
	  						closeOnBgClick: false,
							items: {
								src: '#space-page--post-edit-'+postId
							},
							callbacks: {
					    		close: function() {

						    		// Reset form	
						    		$(".post-submit--textarea").val('');
						    		$(".post-submit--select-categories").val('');

									if (Session.get("fileId")) {
										delete Session.keys["fileId"]; // Clear fileId session
									    Session.set("fileId",false);
									}

									if (Session.get("fileExt")) {
										delete Session.keys["fileExt"]; // Clear fileExt session
									    Session.set("fileExt",false);
						    		}

								}
    						}
						}, 0);
					}
					else if (key == "delete") {
						if (confirm(TAPi18n.__('post-item--delete-post-confirm'))) {
							Posts.remove(postId, function(error) {
								if (error)
									alert(TAPi18n.__('error-message')+error.message);
							});
						}
					}
                },
                items: contextualItems
                // items: {
                // 	pin
                // 	// "pin": {name: textPinned, icon: iconPinned},
                // 	// "favorite": {name: textFavorite, icon: iconFavorite},
                // 	// "edit": {name: "Éditer", icon: "fa-pencil"},
                // 	// "delete": {name: "Supprimer", icon: "fa-trash-o"},
                // }
            };
        }
    });


});

Template.postItem.onCreated(function() {
	imageExtensions = ["jpg","jpeg","png","gif"];
});


Template.postItem.events({

	'click .post-item--button-delete': function(e) {
		e.preventDefault();

		if (confirm("Effacer la publication de "+this.author+"?")) {
			var currentPostId = this._id;
			var currentPost = Posts.findOne(currentPostId);
			Posts.remove(currentPostId, function(error) {
				if (error)
          			alert("Une erreur est survenue : "+error.message);
			});

			if (Session.get('author') !== "") {
				var author = Session.get('author');
				Session.set('postsServerNonReactive', Authors.findOne({name:author}).nRefs);
			}
			else if (Session.get('category') !== "") {
				var category = Session.get('category');
				Session.set('nbPosts',Posts.find({category: category}).fetch().length); 
			}
			else if (Session.get('tag') !== "") {
				var tag = Session.get('tag');
				Session.set('nbPosts',Posts.find({tags: tag}).fetch().length); 
			}
			else
				Session.set('postsServerNonReactive', Counts.findOne().count);

			resetPostInterval();
		}
	},
	'click .filter-author': function(e) {
		e.preventDefault();
		var author = $(e.target).data('author');
		resetFilters();
		Session.set('author',author);
		Session.set('postsServerNonReactive', Authors.findOne({name:author}).nRefs);
		resetPostInterval();
	},
	'click .filter-category': function(e) {
		e.preventDefault();
		var category = $(e.target).data('category');
		resetFilters();
		Session.set('category',category);
		Session.set('postsServerNonReactive', Categories.findOne({name:category}).nRefs);
		resetPostInterval();
	}, 	
	'click .filter-tag': function(e) {
		e.preventDefault();
		var tag = $(e.target).data('tag');
		resetFilters();
		Session.set('tag',tag);
		Session.set('postsServerNonReactive', Tags.findOne({name:tag}).nRefs);
		resetPostInterval();
	},
	'click .post-item--add-like': function(e) {
		e.preventDefault();

		var currentPostId = this._id;
		var author = Session.get(Template.parentData(1).space._id).author; 
		Posts.update(currentPostId, {$push: {likes: author}});
	}, 
	'click .post-item--remove-like': function(e) {
		e.preventDefault();

		var currentPostId = this._id;
		var author = Session.get(Template.parentData(1).space._id).author; 
		Posts.update(currentPostId, {$pull: {likes: author}});
	}, 
	'click .post-item--comment-add-like': function(e) {
		e.preventDefault();

		var currentPostId = $(e.target).data('postid');
		var currentCommentId = this.id;
		var author = Session.get(Template.parentData(1).space._id).author; 
		Meteor.call('addLikeComment',{currentPostId:currentPostId,currentCommentId:currentCommentId,author,author});
	}, 
	'click .post-item--comment-remove-like': function(e) {
		e.preventDefault();

		var currentPostId = $(e.target).data('postid');
		var currentCommentId = this.id;
		var author = Session.get(Template.parentData(1).space._id).author; 
		Meteor.call('removeLikeComment',{currentPostId:currentPostId,currentCommentId:currentCommentId,author,author});
	}, 
	'click .post-item--comment-delete': function(e) {
		e.preventDefault();

		var currentPostId = $(e.target).data('postid');
		var currentCommentId = this.id;

		if (confirm(TAPi18n.__('post-item--delete-comment-confirm')))
			Posts.update(currentPostId, {$pull: {comments: {id:currentCommentId}}});
	},
	'click .post-item--show-comment-input': function(e) {
      e.preventDefault();

      $(e.target).parent().find('textarea').show();
      $(e.target).hide();
  	},
	'keypress .post-item--add-comment-textarea': function (e, template) {
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
	'click .post-item--button-add-favorite': function(e) {
		e.preventDefault();
		var currentPostId = this._id;

		var session = Session.get(Template.parentData(1).space._id);

		if (session.favorites)
			session.favorites.push(currentPostId);
		else {
			session.favorites = [];
			session.favorites.push(currentPostId);
		}
		
		Session.setPersistent(Template.parentData(1).space._id, session); // Persistent to browser refresh
	},
	'click .post-item--button-remove-favorite': function(e) {
		e.preventDefault();
		var currentPostId = this._id;

		var session = Session.get(Template.parentData(1).space._id);

		if (session.favorites) {
			session.favorites = $.grep(session.favorites, function(value) { // Remove currentPostID from favorites array
			  return value != currentPostId;
			});
		}

		Session.setPersistent(Template.parentData(1).space._id, session);
	},
	'click .post-item--button-add-pinned': function(e) {
		e.preventDefault();
		var currentPostId = this._id;

		Posts.update(currentPostId, {$set: {pinned: true}});
	},
	'click .post-item--button-remove-pinned': function(e) {
		e.preventDefault();
		var currentPostId = this._id;

		Posts.update(currentPostId, {$set: {pinned: false}});
	}	
});


Template.postItem.helpers({

	image: function() {
		if (this.fileId && $.inArray(this.fileExt, imageExtensions) != -1)
			return this.fileId
	},
	file: function() {
		if (this.fileId && $.inArray(this.fileExt, imageExtensions) == -1)
			return this.fileId
	},
	favorite: function() {
		if ($.inArray(this._id,Session.get(Template.parentData(1).space._id).favorites) == -1)
			return false;
		else
			return true;
	},
	pinned: function() {
		return this.pinned;
	},
	commentsAllowed: function() {
		if (Template.parentData().space.commentsAllowed)
			return true;
	},
	// tags: function(){
	// 	if (this.tags.length > 1 || this.tags[0] != "")
	// 		return this.tags;
	// 	else
	// 		return 0;
	// },
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
	},
	editAllowed: function() {
		if (Template.parentData().space.postEditPermissions !== undefined) {
			if (Template.parentData().space.postEditPermissions === "all" || (Template.parentData().space.postEditPermissions === "own" && Session.get(Template.parentData().space._id).author === this.author) || Template.parentData().space.userId === Meteor.userId() || Roles.userIsInRole(Meteor.userId(), ['admin']) === true)
				return true
			else
				return false
		}
		else {
			if (Session.get(Template.parentData().space._id).author === this.author || Template.parentData().space.userId === Meteor.userId() || Roles.userIsInRole(Meteor.userId(), ['admin']) === true)
				return true
			else
				return false
		}
	},
	commentEditAllowed: function() {
		if (Template.parentData(2).space.postEditPermissions !== undefined) {
			if (Template.parentData(2).space.postEditPermissions === "all" || (Template.parentData(2).space.postEditPermissions === "own" && Session.get(Template.parentData(2).space._id).author === this.author) || Template.parentData(2).space.userId === Meteor.userId() || Roles.userIsInRole(Meteor.userId(), ['admin']) === true)
				return true
			else
				return false
		}
		else {
			if (Session.get(Template.parentData(2).space._id).author === this.author || Template.parentData(2).space.userId === Meteor.userId() || Roles.userIsInRole(Meteor.userId(), ['admin']) === true)
				return true
			else
				return false
		}
	},
	'selectedAuthorClass': function(){
		if (this.author == Session.get('author'))
			return "post-item--author-selected"
	},	
	'selectedCategoryClass': function(){
		if (this.category == Session.get('category'))
			return "post-item--category-selected"
	},
	'selectedTagClass': function(){
		if (this == Session.get('tag'))
			return "post-item--tag-selected"
	},
});