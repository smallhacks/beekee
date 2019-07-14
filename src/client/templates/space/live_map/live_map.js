
function addMarker(post) {

// var icon = {

//     path: "M-60.7,672.1C-206,461.4-233,439.8-233,362.4c0-106,86-192,192-192s192,86,192,192c0,77.4-27,99-172.3,309.7 C-30.8,685.8-51.2,685.8-60.7,672.1L-60.7,672.1z M-41,483.4c66.8,0,121-54.2,121-121s-54.2-121-121-121s-121,54.2-121,121 S-107.8,483.4-41,483.4z M37.8,318.9v88.7c0,8.2-6.6,14.8-14.8,14.8h-128.1c-8.2,0-14.8-6.6-14.8-14.8v-88.7 c0-8.2,6.6-14.8,14.8-14.8H-78l3.8-10.1c2.2-5.8,7.7-9.6,13.8-9.6h38.6c6.2,0,11.7,3.8,13.8,9.6l3.8,10.1h27.1 C31.2,304.1,37.8,310.7,37.8,318.9z M-4,367.9c0-20.4-16.6-37-37-37s-37,16.6-37,37c0,20.4,16.6,37,37,37S-4,388.3-4,367.9z M-13.9,367.9c0,14.9-12.2,27.1-27.1,27.1s-27.1-12.2-27.1-27.1c0-14.9,12.2-27.1,27.1-27.1S-13.9,353-13.9,367.9z",
//     fillColor: '#0085d1',
//     fillOpacity: 1,
//     anchor: new google.maps.Point(0,0),
//     strokeWeight: 0,
//     scale: 0.08
// }

var icon = {
    url: "/img/marker.png", // url
    scaledSize: new google.maps.Size(30, 40), // scaled size
    origin: new google.maps.Point(0,0), // origin
    anchor: new google.maps.Point(15, 40) // anchor
};

	var marker = new google.maps.Marker({
		position: new google.maps.LatLng(post.latitude, post.longitude),
		draggable: false,
		map: mapInstance,
		icon: icon
	});

	markers[post._id] = marker; // Cache every marker in an object
	markersArray.push(marker);

	// Create an infoWindow
	var infowindow = new google.maps.InfoWindow();
	var content = setInfoWindowContent(post);

	google.maps.event.addListener(marker,'click', (function(marker,content,infowindow){ 
		return function() {
			clearAllInfoWindows();
			infowindow.setContent(content);
			infowindow.open(mapInstance,marker);

		};
	})(marker,content,infowindow));

	infoWindows[post._id] = infowindow; // Cache every infoWindows in an object
	infoWindowsArray.push(infowindow);
}


function setInfoWindowContent(post) {

	var content = '<div class="card1" style="max-width:300px">';
	if (post.filePath)
	    content += '<div class="life-feed-post--image-wrapper"><img class="card-img-top" src="/upload'+escape(post.filePath)+'" alt="Card image cap" /></div>';
	   
	content += '<div class="card-body" style="padding: 0.5em 0 0 0;"><b>'+post.body+'</b><br>Observation de '+post.author+' '+moment(post.submitted).fromNow()+' vers '+post.locality+'<br><br>';

    // Likes
	var author = Session.get(Session.get('spaceId')).author;
	var likeAlready = ($.inArray(author,post.likes) != -1);

	//var bioscopeLikes = Session.get("bioscopeLikes");
	//var bioscopeAlreadyLike = ($.inArray(post._id,bioscopeLikes) != -1);

		content += '<a href="#" onclick="addLike(\''+post._id+'\',\''+post.spaceId+'\')" id="live-map--add-like-'+post._id+'" class="btn-link-black live-map--add-like text-primary ';
		if (likeAlready && author !="Bioscope") {
			content += 'd-none';
		}
		content += '"><i class="far fa-thumbs-up"></i>';
		if (post.likes)
			content += '<span class="small ml-1">'+post.likes.length+'</span>';
		content += '</a>';




		content += '<a href="#" onclick="removeLike(\''+post._id+'\',\''+post.spaceId+'\')" id="live-map--remove-like-'+post._id+'" class="btn-link-black live-map--remove-like text-primary ';
		if (!likeAlready || author == "Bioscope") {
			content += 'd-none';
		}
		content += '"><i class="fas fa-thumbs-up"></i>';
			if (post.likes && post.likes.length > 1)
				content += '<span class="small ml-1">'+TAPi18n.__("live-feed-post--nb-likes-with-me",post.likes.length-1)+'</span>';
			else
				content += '<span class="small ml-1">'+TAPi18n.__("live-feed-post--like")+'</span>';
		content += '</a>';


		// console.log("nombre de likes : "+post.likes.length);
		// if (likeAlready) {
		// 	if (post.likes.length > 1)
		// 		content += '<span class="small">hum'+TAPi18n.__("live-feed-post--nb-likes-with-me")+' '+post.likes.length-1+'</span>';
		// 	else
		// 		content += '<span class="small">'+post.likes.length+'hello</span>';
		// }


		// content += '</a>';

		// content += '<a href="#" onclick="removeLike(\''+post._id+'\',\''+post.spaceId+'\')" id="live-map--remove-like-'+post._id+'" class="btn-link-black live-map--remove-like text-primary ';
		// if (!likeAlready || author == "Bioscope") {
		// 	content += 'd-none';
		// }
		// content += '"><i class="fas fa-thumbs-up"></i>';
		// if (likeAlready) {
		// 	if (post.likes.length > 1)
		// 		content += '<span class="small">hum'+TAPi18n.__("live-feed-post--nb-likes-with-me")+' '+post.likes.length-1+'</span>';
		// 	else
		// 		content += '<span class="small">'+post.likes.length+'hello</span>';
		// }

		// content += '</a>';




		//<span class="small ml-1">blop'+TAPi18n.__("live-feed-post--like")+'</span></a>';



	
	content += '</div>';
	return content;
}


function removeMarker(post) {
	var marker = markers[post._id]; // find the marker by post id
	if (marker)
    	marker.setMap(null);
}


addLike = function(postId, spaceId) {
	var currentPostId = postId;

	var author = Session.get(spaceId).author;
	Posts.update(currentPostId, {$push: {likes: author}});

	// Reset Bioscope like button
	if (author == "Bioscope") {
			$('#live-map--remove-like-'+currentPostId).removeClass("d-none");
			$('#live-map--add-like-'+currentPostId).addClass("d-none");

		 	setTimeout(function() { 
				$('#live-map--remove-like-'+currentPostId).addClass("d-none");
				$('#live-map--add-like-'+currentPostId).removeClass("d-none");
		}, 30000);
	}
}


removeLike = function(postId, spaceId) {
	var currentPostId = postId;
	console.log("postid : "+currentPostId);
	console.log("spaceId : "+spaceId);

	var author = Session.get(spaceId).author;
	console.log("space id "+spaceId);
	Posts.update(currentPostId, {$pull: {likes: author}});

		// $('#live-map--add-like-'+postId).addClass("d-none");
		// $('#live-map--remove-like-'+postId).removeClass("d-none");
}


function clearAllInfoWindows() {

	// Close all the infoWindows
	for (var i=0 ; i<infoWindowsArray.length; i++) {
		infoWindowsArray[i].close();
	}
}


function addDefaultInfoWindow() {

	// Create a new infoWindow to be shown by default if at least one post exists
	if (typeof Posts.findOne({}) != 'undefined') {
		var infowindow = new google.maps.InfoWindow();
		content = setInfoWindowContent(Posts.findOne({})); // Take the first post content
		infowindow.setContent(content);
		infowindow.open(mapInstance,markersArray[0]); // Take the first maker
		mapInstance.setCenter(markersArray[0].getPosition());
		mapInstance.setZoom(11);
		infoWindowsArray.push(infowindow);
	}
}


Template.liveMap.onRendered(function() {


	spaceId = Template.parentData(1).space._id;

	// GoogleMaps initialization
	GoogleMaps.load({key:Meteor.settings.public.googlemapskey});


	this.autorun(function() { // Autorun to reactively update subscription (filtering + interval of loaded posts)

	// Subscribe to posts with latitude + longitudes infos
	// Filter posts if needValidation is set to true (posts are not filters if admin or teacher)
	//if (Template.parentData(1).space.permissions.needValidation) {
		subscription = Meteor.subscribe('posts', {spaceId:Session.get('spaceId'), type:"liveFeed",latitude:{"$exists":true, $ne:null}, longitude:{"$exists":true, $ne:null}, published:true});
	//} else {
	//	subscription = Meteor.subscribe('posts', {spaceId:Session.get('spaceId'), type:"liveFeed",latitude:{"$exists":true, $ne:null}, longitude:{"$exists":true, $ne:null}});
	//}
	});


	markers = {}; // Object of all markers
	markersArray = []; // Object of all markers

	infoWindows = {}; // Object of all infoWindows
	infoWindowsArray = [] // Array of all infoWindows

	//Session.set("bioscopeLikes",[]);

   	// Add markers to the map once it's ready
   	GoogleMaps.ready('liveMap', function(map) {

		mapInstance = map.instance;

		// Observe if posts are added or removed to edit markers
		Posts.find({}).observe({
			added: function(doc) {
		   		addMarker(doc);
			},
			changed: function(doc) {
				var infoWindow = infoWindows[doc._id];
				var content = setInfoWindowContent(doc)
				infoWindow.setContent(content);
			},
			removed: function(doc) {
				removeMarker(doc);
			}
		});
		/** Hide toggle fullscreen button when Google Maps is in fullscreen */
		$(document).bind('webkitfullscreenchange mozfullscreenchange fullscreenchange', function() {
    		var isFullScreen = document.fullScreen ||
        	document.mozFullScreen ||
        	document.webkitIsFullScreen;
    		if (isFullScreen) {
        		$('.live-map--google-maps .gm-style > .gm-fullscreen-control').hide();
        		$('.live-map--overlay').appendTo($('.gm-style').find('div')[0]);
        		$('.live-map--overlay').show();
    		} else {
        		$('.live-map--google-maps .gm-style > .gm-fullscreen-control').show();
        		$('.live-map--overlay').hide();
    		}
		});

		var author = Session.get(spaceId).author;

		if (author == "Bioscope") {
			// Clear the infoWindos if no user event has been detected
			var timeToWait = 30000;
			timeOut = window.setTimeout(function(){clearAllInfoWindows();addDefaultInfoWindow();}, timeToWait);

			mapInstance.addListener('mousemove', function() {

			    window.clearTimeout(timeOut);
			    timeOut = null;

			    if (timeOut == null) {
			    	timeOut = window.setTimeout(function(){clearAllInfoWindows();addDefaultInfoWindow();}, timeToWait);
			    }
			});
		}
	});
});


// Template.liveMap.onCreated(function() {

// 		console.log("created");


//   	// GoogleMaps initialization
// 	//GoogleMaps.load({key:Meteor.settings.public.googlemapskey});
// });


Template.liveMap.helpers({

	liveMapOptions: function() {
    // Make sure the maps API has loaded
    if (GoogleMaps.loaded()) {
      // Map initialization options
		var author = Session.get(Template.parentData(1).space._id).author;

		if (author == "Bioscope") {
	      return {
	        center: new google.maps.LatLng(46.205525, 6.144801),
	        zoom: 11,
	        streetViewControl: false,
	        mapTypeControl:false,
	        zoomControl:false
	      	};
		} else {
	      return {
	        center: new google.maps.LatLng(46.205525, 6.144801),
	        zoom: 11,
	        streetViewControl: false,
	        mapTypeControl:false,
	      };
    	}
    }
  },
  	nbImages: function() {
  		return Posts.find().count();
  	},
   bioscope: function() {
   		var author = Session.get(Template.parentData(1).space._id).author;
  		return (author == "Bioscope");
  	},
  nbAuthors: function() {
  	var posts = Posts.find().fetch();
  	var authors = [];

  	// Count each different author that has posted an image
  	for (var i = 0; i< posts.length; i++) {
  		if ($.inArray(posts[i].author, authors) == -1) {
  			authors.push(posts[i].author);
  		}
  	}
  	return authors.length;
  	}


 //  	'click .live-map--add-like': function(e) {
	// 	e.preventDefault();
	// 	alert("hop");

	// 	var currentPostId = $(e.target).data('postid');
	// 	console.log("postid : "+currentPostId);
	// 	var author = Session.get(Template.parentData(1).space._id).author;
	// 	console.log("space id "+Template.parentData(1).space._id);
	// 	Posts.update(currentPostId, {$push: {likes: author}});

	// 	// Bioscope
	// 	if (author == "Bioscope") {
	// 	 	setTimeout(function() { 
	// 			$('#live-map--remove-like-'+currentPostId).removeClass("d-none");
	// 			$('#live-map--add-like-'+currentPostId).addClass("d-none");
	// 		}, 3000);
	// 	}
	// 	//var bioscopeLikes = Session.get("bioscopeLikes");
	// 	//Session.set("bioscopeLikes",bioscopeLikes.push(currentPostId));
	// }, 
	// 'click .live-map--remove-like': function(e) {
	// 	e.preventDefault();

	// 	var currentPostId = $(e.target).data('postid');
	// 			console.log("postid : "+currentPostId);

	// 	var author = Session.get(Template.parentData(1).space._id).author; 
	// 	Posts.update(currentPostId, {$pull: {likes: author}});
	// }, 
});