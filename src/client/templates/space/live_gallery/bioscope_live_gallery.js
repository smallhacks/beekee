function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function restartSlides() {
	var links = document.getElementById('links').getElementsByTagName('a');

	        options = {
	        	index: 0,
	        	onslide: function (index, slide) {

	        	    // To make things reactive, we use the title of the link to pass the postId
	        	    // And then we load the content reactively from the collection
    				var postId = this.list[index].title;
                 	var post = Posts.findOne(postId);
                 	var author = Session.get(post.spaceId).author;
					var likeAlready = ($.inArray(author,post.likes) != -1);

                	var text = 'Vu par <b>' + post.author+'</b> à '+post.locality;

					text += '<a href="#" id="live-gallery--add-like-'+post._id+'" style="font-size:1.3em;" data-postid="'+post._id+'" class="btn-link-white live-gallery--like live-gallery--add-like ';
					if (likeAlready) {
						text += 'd-none';
					}
					text += '"><i class="far fa-thumbs-up" data-postid="'+post._id+'"></i>';
					if (post.likes)
						text += '<span class="small ml-1" id="live-gallery--post-likes-'+post._id+'" data-postid="'+post._id+'">'+post.likes.length+'</span>';
					text += '</a>';

					text += '<a href="#" id="live-gallery--remove-like-'+post._id+'" style="font-size:1.3em;" data-postid="'+post._id+'" class="btn-link-grey live-gallery--like live-gallery--remove-like text-primary ';
					if (!likeAlready) {
						text += 'd-none';
					}
					text += '"><i class="fas fa-thumbs-up" data-postid="'+post._id+'"></i>';
						if (post.likes && post.likes.length > 1)
							text += '<span class="small ml-1" data-postid="'+post._id+'">'+TAPi18n.__("live-feed-post--nb-likes-with-me",post.likes.length-1)+'</span>';
						else
							text += '<span class="small ml-1" data-postid="'+post._id+'">'+TAPi18n.__("live-feed-post--like")+'</span>';
					text += '</a>';

                	node = this.container.find('.description');
            		node.empty();
            		if (text) {
            			var description = document.createElement('p'); // is a node
						description.innerHTML = text;
                		node[0].appendChild(description);
            		}
        		},
	        	event: event,
	        	onclosed: function() {observeCollection.stop()} // Stop collection observing
	        }


		gallery = blueimp.Gallery(links,options);
		gallery.play();

		var randomSlide = getRandomInt(0,Posts.find().count()-1);
		gallery.slide(randomSlide);

		    // Observe changes in db and dynamically add images
	 	var initializing = true; // Avoid added function to be trigged at first load
	  	observeCollection = Posts.find().observeChanges({
	    	added: function(id, doc) {
	      		if (!initializing) {
			   		gallery.add([{
	        			title: id,
	        			href: '/upload/'+escape(doc.filePath),
	        			type: 'image/jpeg'
	    			}]);
			   	}
	    	},
	    	removed: function(id, doc) {

	    			// If an image is deleted, we need to close the slideshow and reopen it again
	    			gallery.close();
	    			window.setTimeout(function(){restartSlides();}, 1000);	
	    	}
	  });
	  initializing = false;

	$("#blueimp-gallery").removeClass("blueimp-gallery-controls");	
}


Template.bioscopeLiveGallery.onCreated(function() {

	Session.set(Template.parentData(1).space._id,"Bioscope");

	this.autorun(function() { // Autorun to reactively update subscription (filtering + interval of loaded posts)

	// Subscribe to posts
	// Filter posts if needValidation is set to true (posts are not filters if admin or teacher)
	//if (Template.parentData(1).space.permissions.needValidation) {
			subscription = Meteor.subscribe('posts', {spaceId:Session.get('spaceId'), type:"liveFeed", published:true});
	//} else {
	//	subscription = Meteor.subscribe('posts', {spaceId:Session.get('spaceId'), type:"liveFeed"});
	//}


});
});


Template.bioscopeLiveGallery.onRendered(function() {

	blueimp.Gallery.prototype.setTitle = function (index) {
	      var firstChild = this.slides[index].firstChild
	      var text = firstChild.title || firstChild.alt
	      var titleElement = this.titleElement
	      if (titleElement.length) {
	        this.titleElement.empty()
	        if (text) {
	        	var description = document.createElement('p'); // is a node
				description.innerHTML = text;
	            titleElement[0].appendChild(description);
	        }
	      }
	    }

	// Blueimp Gallery initialization
	document.getElementById('links').onclick = function (event) {

		// Make sure controls are showed
		$("#blueimp-gallery").addClass("blueimp-gallery-controls");	

	    event = event || window.event;
	    var target = event.target || event.srcElement,
	        link = target.src ? target.parentNode : target,
	        options = {
	        	index: link,
	        	onslide: function (index, slide) {

	        	    // To make things reactive, we use the title of the link to pass the postId
	        	    // And then we load the content reactively from the collection
    				var postId = this.list[index].title;
                 	var post = Posts.findOne(postId);
                 	var author = Session.get(post.spaceId).author;
					var likeAlready = ($.inArray(author,post.likes) != -1);

                	var text = 'Vu par <b>' + post.author+'</b> à '+post.locality;

					text += '<a href="#" id="live-gallery--add-like-'+post._id+'" style="font-size:1.3em;" data-postid="'+post._id+'" class="btn-link-white live-gallery--like live-gallery--add-like ';
					if (likeAlready) {
						text += 'd-none';
					}
					text += '"><i class="far fa-thumbs-up" data-postid="'+post._id+'"></i>';
					if (post.likes)
						text += '<span class="small ml-1" id="live-gallery--post-likes-'+post._id+'" data-postid="'+post._id+'">'+post.likes.length+'</span>';
					text += '</a>';

					text += '<a href="#" id="live-gallery--remove-like-'+post._id+'" style="font-size:1.3em;" data-postid="'+post._id+'" class="btn-link-grey live-gallery--like live-gallery--remove-like text-primary ';
					if (!likeAlready) {
						text += 'd-none';
					}
					text += '"><i class="fas fa-thumbs-up" data-postid="'+post._id+'"></i>';
						if (post.likes && post.likes.length > 1)
							text += '<span class="small ml-1" data-postid="'+post._id+'">'+TAPi18n.__("live-feed-post--nb-likes-with-me",post.likes.length-1)+'</span>';
						else
							text += '<span class="small ml-1" data-postid="'+post._id+'">'+TAPi18n.__("live-feed-post--like")+'</span>';
					text += '</a>';

                	node = this.container.find('.description');
            		node.empty();
            		if (text) {
            			var description = document.createElement('p'); // is a node
						description.innerHTML = text;
                		node[0].appendChild(description);
            		}
        		},
	        	event: event,
	        	preloadRange: 3,
	        	onclosed: function() {observeCollection.stop()} // Stop collection observing
	        },
	        links = this.getElementsByTagName('a');

	    gallery = blueimp.Gallery(links, options);

	    // Observe changes in db and dynamically add images
	 	var initializing = true; // Avoid added function to be trigged at first load
	  	observeCollection = Posts.find().observeChanges({
	    	added: function(id, doc) {
	      		if (!initializing) {
			   		gallery.add([{
	        			title: id,
	        			href: '/upload/'+escape(doc.filePath),
	        			type: 'image/jpeg'
	    			}]);
			   	}
	    	},
	    	removed: function(id, doc) {

	    			// If an image is deleted, we need to close the slideshow and reopen it again
	    			gallery.close();
	    			window.setTimeout(function(){restartSlides();}, 1000);	
	    	}
	  });
	  initializing = false;
	}
	
	window.setTimeout(function(){restartSlides();}, 1000);	

});


Template.bioscopeLiveGallery.events({

	'click .live-gallery--add-like': function(e) {
		e.preventDefault();
		var postId = $(e.target).data('postid');
        var post = Posts.findOne(postId);
		var author = Session.get(post.spaceId).author;
		Posts.update(postId, {$push: {likes: author}});
		console.log("on ajoute un like");

		$('#live-gallery--add-like-'+postId).addClass("d-none");
		$('#live-gallery--remove-like-'+postId).removeClass("d-none");

	},
	'click .live-gallery--remove-like': function(e) {
		e.preventDefault();
		var postId = $(e.target).data('postid');
        var post = Posts.findOne(postId);
		var author = Session.get(post.spaceId).author;
		Posts.update(postId, {$pull: {likes: author}});
		console.log("on retire un like");
		$('#live-gallery--add-like-'+postId).removeClass("d-none");
		$('#live-gallery--remove-like-'+postId).addClass("d-none");

		var likesLenght = Posts.findOne(postId).likes.length;
		$('#live-gallery--post-likes-'+postId).text(likesLenght);
	}
});


Template.bioscopeLiveGallery.helpers({

	images: function() {
		return Posts.find({type:"liveFeed"},{sort: {likes: -1}});
	},
	filePath: function() {
		return escape(this.filePath);
	},
	thumbPath: function() {
		return escape(this.thumbPath);
	}
});