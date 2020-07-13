import { Template } from 'meteor/templating';

import './settings.html';
import './permissions_settings.js';
import './modules_settings.js';
import './general_settings.js';

import '../../headers/back_header.js';


Template.settings.onCreated(function() {

	viewport = document.querySelector("meta[name=viewport]");
	viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=4');

	Session.set('spaceId',this.data.space._id);
	Session.set('postToEdit',false);
	Session.set('postToDelete',false);

	// resetFilters();
	// Session.set('postsServerNonReactive', Counts.findOne().count); // Set a non-reactive counter of posts -> here = all server posts
	// resetPostInterval();
	// Session.set('last', true);

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
				subscription = Meteor.subscribe('posts', {spaceId:Session.get('spaceId'),type:"resource"});
				break;
		}
	});

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

Template.settings.onRendered(function () {

$("body").tooltip({selector: '[data-toggle=tooltip]', trigger: 'hover'});
});


Template.settings.helpers({

	menuItem: function(menuItem) {
		return (Session.get('menuItem') == menuItem);
	}
});