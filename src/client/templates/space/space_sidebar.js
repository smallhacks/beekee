Template.spaceSidebar.events({

	'change #langSelect': function(e) {
		var lang = $(e.target).val();
		Session.setPersistent('lang',lang);
	},
	'click .menu-item': function(e) {
		e.preventDefault();
		var menuItemId = $(e.currentTarget).attr("data-id");
		Session.set('menuItem',menuItemId);

		if (menuItemId != "2") { // Dismiss sidebar unless menuItem is not "Live feed"
			$('#sidebar').removeClass('active');
	        $('.overlay').removeClass('active');
	        $('.collapse.in').removeClass('in');
	    }
	},
	'click .space-sidebar--category-edit': function(e) {
		e.preventDefault();
		var categoryName = $(e.target).data("category");
		Session.set('categoryToEdit',categoryName);
		$('#liveFeedCategoryEdit').modal('show');
	},
	'click .filter-all': function(e) {
		e.preventDefault();
		resetFilters();
		Session.set('postsServerNonReactive', LiveFeedCounts.findOne().count);
		resetPostInterval();
	}, 	
	'click .filter-category': function(e) {
		e.preventDefault();
		e.stopPropagation();
		var category = $(e.target).data('category');
		resetFilters();
		Session.set('category',category);
		Session.set('postsServerNonReactive', Categories.findOne({name:category}).nRefs);
		resetPostInterval();

		// Dismiss sidebar
		$('#sidebar').removeClass('active');
	    $('.overlay').removeClass('active');
	    $('.collapse.in').removeClass('in');
	}, 	
	'click .filter-author': function(e) {
		e.preventDefault();
		e.stopPropagation();
		var author = $(e.target).data('author');
		resetFilters();
		Session.set('author',author);
		Session.set('postsServerNonReactive', Authors.findOne({name:author}).nRefs);
		resetPostInterval();

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
	'selectedCategory': function(){
		if (this.name == Session.get('category'))
			return "font-weight-bold menu-item--selected selected"
		else
			return "font-weight-light"
	},
	'selectedAuthor': function(){
		if (this.name == Session.get('author'))
			return "font-weight-bold menu-item--selected selected"
		else
			return "font-weight-light"
	},
	liveFeedCount: function() {
		var liveFeedCount = LiveFeedCounts.findOne();
		return liveFeedCount && liveFeedCount.count;
	},
	categories: function() {
		return Categories.find({}, {sort: {name: 1}});
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
	permissionAddCategories: function() {
		if (this.space.permissions.addCategories || Roles.userIsInRole(Meteor.userId(), ['admin']) || Meteor.userId() == this.space.userId)
			return true
		else
			return false
	}
});