// Copyright 2016-2020 UNIVERSITY OF GENEVA (GENEVA, SWITZERLAND)

// This file is part of Beekee Live.
    
// Beekee Live is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Beekee Live is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
//  along with Beekee Live.  If not, see <https://www.gnu.org/licenses/>.

//**************************************************************************


Template.spaceSidebar.events({

	'change #langSelect': function(e) {
		var lang = $(e.target).val();
		Session.setPersistent('lang',lang);
	},
	'click .menu-item': function(e) {
		e.preventDefault();
		var menuItemId = $(e.currentTarget).attr("data-id");
		Session.set('menuItem',menuItemId);

		if (menuItemId != "1" && menuItemId != "2" && menuItemId != "4") { // Dismiss sidebar unless menuItem is not "Live feed"
			$('#sidebar').removeClass('active');
	        $('.overlay').removeClass('active');
	        $('.collapse.in').removeClass('in');
	    }
	},
	'click .space-sidebar--live-feed-category-edit': function(e) {
		e.preventDefault();
		var categoryName = $(e.target).data("category");
		Session.set('numChars', categoryName.length); // Count the number of characters
		Session.set('liveFeedCategoryToEdit',categoryName);
		$('#liveFeedCategoryEdit').modal('show');
	},
	'click .space-sidebar--resources-category-edit': function(e) {
		e.preventDefault();
		var categoryName = $(e.target).data("category");
		Session.set('numChars', categoryName.length); // Count the number of characters
		Session.set('resourcesCategoryToEdit',categoryName);
		$('#resourcesCategoryEdit').modal('show');
	},
	'click .filter-live-feed-all': function(e) {
		e.preventDefault();
		liveFeedResetFilters();
		Session.set('postsServerNonReactive', LiveFeedCounts.findOne().count);
		liveFeedResetPostInterval();
	}, 
	'click .filter-resources-all': function(e) {
		e.preventDefault();
		resourcesResetFilters();
	}, 		
	'click .filter-live-feed-category': function(e) {
		e.preventDefault();
		e.stopPropagation();
		var category = $(e.target).data('category');
		liveFeedResetFilters();
		Session.set('liveFeedCategory',category);
		Session.set('postsServerNonReactive', Categories.findOne({name:category}).nRefs);
		liveFeedResetPostInterval();

		// Dismiss sidebar
		$('#sidebar').removeClass('active');
	    $('.overlay').removeClass('active');
	    $('.collapse.in').removeClass('in');
	}, 	
	'click .filter-resources-category': function(e) {
		e.preventDefault();
		e.stopPropagation();
		var category = $(e.target).data('category');
		resourcesResetFilters();
		Session.set('resourcesCategory',category);

		// Dismiss sidebar
		$('#sidebar').removeClass('active');
	    $('.overlay').removeClass('active');
	    $('.collapse.in').removeClass('in');
	}, 	
	'click .filter-author': function(e) {
		e.preventDefault();
		e.stopPropagation();
		var author = $(e.target).data('author');
		liveFeedResetFilters();
		Session.set('author',author);
		Session.set('postsServerNonReactive', Authors.findOne({name:author}).nRefs);
		liveFeedResetPostInterval();

		// Dismiss sidebar
		$('#sidebar').removeClass('active');
	    $('.overlay').removeClass('active');
	    $('.collapse.in').removeClass('in');
	}
});


Template.spaceSidebar.helpers({

	langIsSelected: function(lang) {
		if (Session.get('lang') == lang)
			return 'selected'
	},
	'selectedMenuItem': function(menuItemId) {
		return menuItemId == Session.get('menuItem');
	},
	'selectedMenuItemBg': function(menuItemId) {
		if (menuItemId == Session.get('menuItem'))
			return "menu-item--selected"	
	},
	'selectedMenuItemTxt': function(menuItemId) {
		if (menuItemId == Session.get('menuItem'))
			return "font-weight-bold selected"
		else
			return "font-weight-light"
	},
	'selectedLiveFeedCategory': function(){
		if (this.name == Session.get('liveFeedCategory'))
			return "menu-item--selected selected"
		else
			return ""
	},
	'selectedResourcesCategory': function(){
		if (this.name == Session.get('resourcesCategory'))
			return "menu-item--selected selected"
		else
			return ""
	},
	'selectedAuthor': function(){
		if (this.name == Session.get('author'))
			return "menu-item--selected selected"
		else
			return ""
	},
	liveFeedCount: function() {
		var liveFeedCount = LiveFeedCounts.findOne();
		return liveFeedCount && liveFeedCount.count;
	},
	liveFeedCategories: function() {
		return Categories.find({type:"liveFeed"}, {sort: {name: 1}});
	},
	resourcesCategories: function() {
		return Categories.find({type:"resource"}, {sort: {name: 1}});
	},
	authors: function() {
		return Authors.find({}, {sort: {name: 1}});
	},
	liveFeed: function() {
		return this.space.liveFeed
	},
	lessons: function() {
		return this.space.lessons
	},
	resources: function() {
		return this.space.resources
	},
	ownSpace: function() {
		if (Meteor.userId() == Template.parentData(1).space.userId || Roles.userIsInRole(Meteor.userId(), ['admin']))
			return true
		else
			return false
	},
	liveFeedAddCategory: function() {
		if (this.space.permissions.liveFeedAddCategory || Roles.userIsInRole(Meteor.userId(), ['admin']) || Meteor.userId() == this.space.userId)
			return true
		else
			return false
	}
});