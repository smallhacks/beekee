Template.settingsSidebar.events({
	
	'click .menu-item': function(e) {
		e.preventDefault();
		var menuItemId = $(e.currentTarget).attr("data-id");
		Session.set('menuItem',menuItemId);
	},
	'click .space-sidebar--category-edit': function(e) {
		e.preventDefault();
		var categoryName = $(event.target).data("category");
		Session.set('categoryToEdit',categoryName);
		$('#liveFeedCategoryEdit').modal('show');
	},
	'click .filter-all': function(e) {
		e.preventDefault();
		resetFilters();
		//Session.set('postsServerNonReactive', Categories.findOne({name:category}).nRefs);
		//resetPostInterval();
	}, 	
	'click .filter-category': function(e) {
		e.preventDefault();
		e.stopPropagation();
		var category = $(e.target).data('category');
		resetFilters();
		Session.set('category',category);
		Session.set('postsServerNonReactive', Categories.findOne({name:category}).nRefs);
		resetPostInterval();
	}, 	
	'click .filter-author': function(e) {
		e.preventDefault();
		e.stopPropagation();
		var author = $(e.target).data('author');
		resetFilters();
		Session.set('author',author);
		Session.set('postsServerNonReactive', Authors.findOne({name:author}).nRefs);
		resetPostInterval();
	}
});


Template.settingsSidebar.helpers({

	'selectedMenuItem': function(menuItemId) {
		return menuItemId == Session.get('menuItem');
	},
	'selectedMenuItemBg': function(menuItemId) {
		if (menuItemId == Session.get('menuItem'))
			return "bg-white"	
	},
	'selectedMenuItemTxt': function(menuItemId) {
		if (menuItemId == Session.get('menuItem'))
			return "font-weight-bold"
		else
			return "font-weight-light"
	},
	'selectedCategory': function(){
		if (this.name == Session.get('category'))
			return "font-weight-bold bg-white"
		else
			return "font-weight-light"
	},
	'selectedAuthor': function(){
		if (this.name == Session.get('author'))
			return "font-weight-bold bg-white"
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
	}
});