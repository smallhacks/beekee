
Template.liveGallery.onCreated(function() {

	// Subscribe to posts
	subscription = Meteor.subscribe('posts', {spaceId:Session.get('spaceId'), type:"liveFeed"});
});


Template.liveGallery.onRendered(function() {

	// Blueimp Gallery initialization
	document.getElementById('links').onclick = function (event) {
	    event = event || window.event;
	    var target = event.target || event.srcElement,
	        link = target.src ? target.parentNode : target,
	        options = {
	        	index: link,
	        	        onslide: function (index, slide) {
            var text = this.list[index].getAttribute('data-description'),
                node = this.container.find('.description');
            node.empty();
            if (text) {
                node[0].appendChild(document.createTextNode(text));
            }
        },
	        	event: event
	        },
	        links = this.getElementsByTagName('a');

	    gallery = blueimp.Gallery(links, options);

	    // Observe changes in db and dynamically add images
	 	var initializing = true; // Avoid added function to be trigged at first load
	  	Posts.find().observeChanges({
	    	added: function(id, doc) {
	      		if (!initializing) {
			   		gallery.add([{
	        			title: doc.author,
	        			description: doc.body,
	        			href: '/upload/'+escape(doc.filePath),
	        			type: 'image/jpeg',
	        			thumbnail: 'https://example.org/thumbnails/banana.jpg'
	    			}]);
			   	}
	    	}
	  });
	  initializing = false;
	}
});


Template.liveGallery.helpers({

	images: function() {
		return Posts.find({type:"liveFeed"},{sort: {likes: -1}});
	},
	filePath: function() {
		return escape(this.filePath);
	},
});