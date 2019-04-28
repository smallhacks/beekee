


function addMarker(post) {



	var marker = new google.maps.Marker({
		position: new google.maps.LatLng(post.latitude, post.longitude),
		draggable: true,
		map: mapInstance
	});
	markers[post._id] = marker; // Cache every marker in an object

	// Info Window content
	var content = '<div class="card1" style="max-width:300px">';
	if (post.filePath)
	    content += '<div class="life-feed-post--image-wrapper"><a class="life-feed-post--image-link" href="/upload'+escape(post.filePath)+'" target="_blank"><img class="card-img-top" src="/upload'+escape(post.filePath)+'" alt="Card image cap" /></a></div>';
	   
	content += '<div class="card-body"><h6 class="card-title">'+post.author+'</h6><div class="card-text">'+post.body+'</div>';

	// Likes
	var author = Session.get(Session.get('spaceId')).author;
	var alreadyLike = ($.inArray(author,post.likes) != -1);
	console.log("alreadyLike : "+alreadyLike);
	//if ($.inArray(author,post.likes) != -1) {
		content += '<a href="#" onclick="addLike(\''+post._id+'\',\''+post.spaceId+'\')" id="live-map--add-like-'+post._id+'" class="btn-link-black live-map--add-like text-primary ';
		if (alreadyLike)
			content += 'd-none';
		content += '"><i class="far fa-thumbs-up"></i></a>';

		content += '<a href="#" onclick="removeLike(\''+post._id+'\',\''+post.spaceId+'\')" id="live-map--remove-like-'+post._id+'" class="btn-link-black live-map--remove-like text-primary ';
		if (!alreadyLike)
			content += 'd-none';
		content += '"><i class="fas fa-thumbs-up"></i><span class="small ml-1">'+TAPi18n.__("live-feed-post--like")+'</span></a>';
	
	content += '</div>';



		//+if(alreadyLike){return d-none}+'" id="live-map--remove-like-'+post._id+'" data-postid="'+post._id+'"><i class="fas fa-thumbs-up"></i></a>';
	//} else {
		//content += '<a href="#" onclick="addLike(\''+post._id+'\',\''+post.spaceId+'\')" id="live-map--add-like-'+post._id+'" class="live-map--add-like" data-postid="'+post._id+'">gdfgdf<i class="far fa-thumbs-up"></i></a>';
	//}
	//content += '</div>';





	//$(".live-map--add-like").on("click", function());

	var infowindow = new google.maps.InfoWindow()

	google.maps.event.addListener(marker,'click', (function(marker,content,infowindow){ 
		return function() {
			infowindow.setContent(content);
			infowindow.open(mapInstance,marker);

		};
	})(marker,content,infowindow));

	infoWindows[post._id] = infowindow; // Cache every infoWindows in an object


}


function updateInfoWindow(post){
	var infoWindow = infoWindows[post._id];
		// Info Window content
	var content = '<div class="card1" style="max-width:300px">';
	if (post.filePath)
	    content += '<div class="life-feed-post--image-wrapper"><a class="life-feed-post--image-link" href="/upload'+escape(post.filePath)+'" target="_blank"><img class="card-img-top" src="/upload'+escape(post.filePath)+'" alt="Card image cap" /></a></div>';
	   
	content += '<div class="card-body"><h6 class="card-title">'+post.author+'</h6><div class="card-text">'+post.body+'</div>';

	// Likes
	var author = Session.get(Session.get('spaceId')).author;
	var alreadyLike = null;

	if (author == "Bioscope") {
		alreadyLike = false;
	} else {
			 alreadyLike = ($.inArray(author,post.likes) != -1);

	}
	//var alreadyLike = ($.inArray(author,post.likes) != -1);
	console.log("alreadyLike : "+alreadyLike);
	//if ($.inArray(author,post.likes) != -1) {
		content += '<a href="#" onclick="addLike(\''+post._id+'\',\''+post.spaceId+'\')" id="live-map--add-like-'+post._id+'" class="btn-link-black live-map--add-like text-primary ';
		if (alreadyLike)
			content += 'd-none';
		content += '"><i class="far fa-thumbs-up"></i></a>';

		content += '<a href="#" onclick="removeLike(\''+post._id+'\',\''+post.spaceId+'\')" id="live-map--remove-like-'+post._id+'" class="btn-link-black live-map--remove-like text-primary ';
		if (!alreadyLike)
			content += 'd-none';
		content += '"><i class="fas fa-thumbs-up"></i><span class="small ml-1">'+TAPi18n.__("live-feed-post--like")+'</span></a>';
	
	content += '</div>';
    infoWindow.setContent(content);
} 

function removeMarker(post) {
	var marker = markers[post._id]; // find the marker by post id
    marker.setMap(null);
}


addLike = function(postId, spaceId) {
	var currentPostId = postId;

	var author = Session.get(spaceId).author;
	Posts.update(currentPostId, {$push: {likes: author}});

	// Bioscope can like as many time as he wants
	// if (author == "Bioscope") {
	// 	// Remove the unlike eventlistener
	// 	$('#live-map--remove-like-'+postId).prop("onclick", null).off("click");

	// 	// Set a timer to reset the like button
	// 	setTimeout(function() { 
	// 		$('#live-map--remove-like-'+postId).addClass("d-none");
	// 		$('#live-map--add-like-'+postId).removeClass("d-none");
	// 	}, 60000);

	// } else {
	// 	$('#live-map--add-like-'+postId).addClass("d-none");
	// 	$('#live-map--remove-like-'+postId).removeClass("d-none");
	// }
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


Template.liveMap.onCreated(function() {

	// Subscribe to posts with latitude + longitudes infos
	subscription = Meteor.subscribe('posts', {spaceId:Session.get('spaceId'), type:"liveFeed",latitude:{"$exists":true, $ne:null}, longitude:{"$exists":true, $ne:null}});

	markers = {}; // Object of all markers
	infoWindows = {}; // Object of all infoWindows


   	// Add markers to the map once it's ready
   	GoogleMaps.ready('liveMap', function(map) {

		mapInstance = map.instance;

		// Observe if posts are added or removed to edit markers
		Posts.find({}).observe({
			added: function(doc) {
		   		addMarker(doc);
			},
			changed: function(doc) {
				updateInfoWindow(doc);
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
        		$('.gm-style > .gm-fullscreen-control').hide();
    		} else {
        		$('.gm-style > .gm-fullscreen-control').show();
    		}
		});
	});
});


Template.liveMap.onRendered(function() {

  	// GoogleMaps initialization
	GoogleMaps.load({key:Meteor.settings.public.googlemapskey});
});


Template.liveMap.helpers({

	liveMapOptions: function() {
    // Make sure the maps API has loaded
    if (GoogleMaps.loaded()) {
      // Map initialization options
      return {
        center: new google.maps.LatLng(46.194365399999995, 6.140539),
        zoom: 11,
        streetViewControl: false
      };
    }
  },
  	'click .live-map--add-like': function(e) {
		e.preventDefault();
		alert("hop");

		var currentPostId = $(e.target).data('postid');
		console.log("postid : "+currentPostId);
		var author = Session.get(Template.parentData(1).space._id).author;
		console.log("space id "+Template.parentData(1).space._id);
		Posts.update(currentPostId, {$push: {likes: author}});
	}, 
	'click .live-map--remove-like': function(e) {
		e.preventDefault();

		var currentPostId = $(e.target).data('postid');
				console.log("postid : "+currentPostId);

		var author = Session.get(Template.parentData(1).space._id).author; 
		Posts.update(currentPostId, {$pull: {likes: author}});
	}, 
});