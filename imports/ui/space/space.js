import { Template } from 'meteor/templating';

import { Spaces } from '../../api/spaces.js';
import { Categories } from '../../api/categories.js';


import './space.html';
import './space_sidebar.js';
import './home/home.js';
import './home/home_post_submit.js';
import './home/home_post_edit.js';
import './home/home_post_delete.js';

import '../headers/space_header.js';


Template.space.onCreated(function() {

	//Set locale
	var lang = null;
	if (Session.get('lang')) // If locale is set by user
		lang = Session.get('lang');
	else {
		// Set locale according to browser
		function getLang() {
			console.log(navigator.languages[0]);
		    return (
		        navigator.languages && navigator.languages[0] ||
		        navigator.language ||
		        navigator.browserLanguage ||
		        navigator.userLanguage ||
		        'en-US'
		    );
		}
		lang = getLang();
		Session.set('lang',lang);
	}
	
	Deps.autorun(function() {

		//TAPi18n.setLanguage(Session.get('lang')); // Translation of app-specific texts
		//T9n.setLanguage(Session.get('lang')); // Translation for basic Meteor packages (account, etc.)
		moment.locale(Session.get('lang')); // Translation for livestamp

		if (typeof Cookie.get('spacesVisited') != "undefined") { // Autorun to reactively update space visited subscription
			var spaces = JSON.parse(Cookie.get('spacesVisited'));
			Meteor.subscribe('spacesVisited', spaces);
		}
	});

	viewport = document.querySelector("meta[name=viewport]");
	viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=4');

	Session.set('spaceId',this.data.space._id);
	Session.set('postToEdit',false);
	Session.set('postToDelete',false);

	Session.set('menuItem',"1"); // interface

	this.autorun(function() { // Autorun to reactively update subscription (filtering + interval of loaded posts)

		switch(Session.get('menuItem')) {
			case "1":
				subscription = Meteor.subscribe('posts', {spaceId:Session.get('spaceId'),type:"home"});
				break;
			case "2":
				//subscription = Meteor.subscribe('posts', {spaceId:Session.get('spaceId'),type:"liveFeed"},{});
				break;
			case "3":
				subscription = Meteor.subscribe('posts', {spaceId:Session.get('spaceId'),type:"lesson"});
				break;
			case "4":
				//subscription = Meteor.subscribe('posts', {spaceId:Session.get('spaceId'),type:"resource"});
				break;
		}
	});

	// Set language
	// var lang = null;
	// if (Session.get('lang')) // If locale is set by user
	// 	lang = Session.get('lang');
	// else {
	// 	// Set locale according to browser
	// 	function getLang() {
	// 		console.log(navigator.languages[0]);
	// 	    return (
	// 	        navigator.languages && navigator.languages[0] ||
	// 	        navigator.language ||
	// 	        navigator.browserLanguage ||
	// 	        navigator.userLanguage ||
	// 	        'en-US'
	// 	    );
	// 	}
	// 	lang = getLang();
	// 	Session.set('lang',lang);
	// }

		// var postsToSkip = Session.get('postsToSkip');
		// var postsLimit = Session.get('postsLimit');

		// var filters = {spaceId:Session.get('spaceId')};
		// if (Session.get('author') != "")
		// 	filters = {spaceId:Session.get('spaceId'), author:Session.get('author')}
		// else if (Session.get('category') != "")
		// 	filters = {spaceId:Session.get('spaceId'), category:Session.get('category')}
		// else if (Session.get('tag') != "")
		// 	filters = {spaceId:Session.get('spaceId'), tags:Session.get('tag')}
		// else if (Session.get('pinned') == true) 
		// 	filters = {spaceId:Session.get('spaceId'), pinned:true}
		// else if (Session.get('files') == true) 
		// 	filters = {spaceId:Session.get('spaceId'), $and : [{fileId:{$exists:true} },{fileId:{$ne:false} },{fileExt:{$nin : ["jpg","jpeg","png","gif"]}}]}
		// else if (Session.get('images') == true) 
		// 	filters = {spaceId:Session.get('spaceId'), $and : [{fileId:{$exists:true} },{fileId:{$ne:false} },{fileExt:{$in : ["jpg","jpeg","png","gif"]}}]}
		// else if (Session.get('favorites') == true) {
		// 	var favorites = Session.get(Session.get('spaceId')).favorites;
		// 	if (favorites)
		// 		filters = {_id:{$in: favorites}}
		// }

 		// Interval of posts subscription : load every posts from "postsToSkip" (skip) to "postsLimit" (limit)
 		// By default, load the 10 last posts (skip : total posts - 10 / limit : 10)
 		// postsLimit (limit) is used to disable reactivity

 	// 	if (!Session.get('isReactive')) 
		// 	subscription = Meteor.subscribe('posts', filters, postsToSkip, postsLimit);
		// 	//subscription = Meteor.subscribe('posts', filters, postsToSkip, postsLimit2);
		// else
	// 	if (Session.get('last') == true)
	// 		subscription = Meteor.subscribe('posts', filters, postsToSkip, postsLimit);
	// 	else
	// 		subscription = Meteor.subscribe('posts', filters, 0, postsLimit);
	// });
});

Template.space.onRendered(function () {

$("body").tooltip({selector: '[data-toggle=tooltip]', trigger: 'hover'});

    document.title = 'Beekee - '+this.data.space.title;


   // $("#sidebar").mCustomScrollbar({
   //          theme: "minimal"
   //      })

});

Template.space.events({
	'click .overlay': function(e) {
            $('#sidebar').removeClass('active');
            $('.overlay').removeClass('active');
    },
    	'click #dismiss': function(e) {
            $('#sidebar').removeClass('active');
            $('.overlay').removeClass('active');
    },
    	'click #sidebarCollapse': function(e) {
   			$('#sidebar').addClass('active');
            // fade in the overlay
            $('.overlay').addClass('active');
            $('.collapse.in').toggleClass('in');
        // and also adjust aria-expanded attributes we use for the open/closed arrows
        // in our CSS
        //$('a[aria-expanded=true]').attr('aria-expanded', 'false');
    }
});


Template.space.helpers({

	menuItem: function(menuItem) {
		return (Session.get('menuItem') == menuItem);
	}
});