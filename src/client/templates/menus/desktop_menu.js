Template.desktopMenu.events({
	
	'click .desktop-menu--show-all': function(e) {
		e.preventDefault();
		resetFilters();
		Session.set('postsServerNonReactive', Counts.findOne().count);
		resetPostInterval();
	},
	'click .filter-last': function(e) {
		e.preventDefault();
		resetFilters();
		Session.set('last', true);
		Session.set('postsServerNonReactive', Counts.findOne().count);
		resetPostInterval();
	},
	'click .filter-pinned': function(e) {
		e.preventDefault();
		resetFilters();
	 	Session.set('pinned',true);
	 	Session.set('postsServerNonReactive', PinnedCounts.findOne().count);
		resetPostInterval();
	},
	'click .filter-files': function(e) {
		e.preventDefault();
		resetFilters();
	 	Session.set('files',true);
	 	Session.set('postsServerNonReactive', FilesCounts.findOne().count);
		resetPostInterval();
	},
	'click .filter-images': function(e) {
		e.preventDefault();
		resetFilters();
	 	Session.set('images',true);
	 	Session.set('postsServerNonReactive', ImagesCounts.findOne().count);
		resetPostInterval();
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
	'click .filter-favorites': function(e) {
		e.preventDefault();
		resetFilters();
		Session.set('favorites',true);
		favorites = Session.get(Template.parentData(1).space._id).favorites;
		Session.set('postsServerNonReactive', favorites.length);
		resetPostInterval();
	}
});


Template.desktopMenu.helpers({

	postCount: function() {
		var count = Counts.findOne();
		return count && count.count;
	},
	pinnedCount: function() {
		var pinnedCount = PinnedCounts.findOne();
		return pinnedCount && pinnedCount.count;
	},	
	favoritesCount: function() {
		var favorites = Session.get(Template.parentData(1).space._id).favorites;
		return favorites && favorites.length;
	},
	filesCount: function() {
		var filesCount = FilesCounts.findOne();
		return filesCount && filesCount.count;
	},	
	imagesCount: function() {
		var imagesCount = ImagesCounts.findOne();
		return imagesCount && imagesCount.count;
	},	
	authorNRef: function() {
		var author = Authors.findOne({name:this.name});
		return author && author.nRefs;
	},
	categoriesNRef: function() {
		var category = Categories.findOne({name:this.name});
		return category && category.nRefs;
	},
	tagsNRef: function() {
		var tag = Tags.findOne({name:this.name});
		return tag && tag.nRefs;
	},
	authors: function() {
		return Authors.find({}, {sort: {name: 1}});
	},
	categories: function() {
		return Categories.find({}, {sort: {name: 1}});
	},
	tags: function() {
		return Tags.find({}, {sort: {name: 1}});
	},	
	'selectedShowAll': function() { // Add a class if element is selected
		if (Session.get('author') == '' && Session.get('category') == '' && Session.get('tag') == '' && Session.get('favorites') == false && Session.get('pinned') == false && Session.get('files') == false && Session.get('images') == false)
			return "desktop-menu--list-element-selected"	
	},
	'selectedLast': function() {
		if (Session.get('last') == true)
			return "desktop-menu--list-element-selected"	
	},
	'selectedPinned': function() {
		if (Session.get('pinned') == true)
			return "desktop-menu--list-element-selected"	
	},
	'selectedFavorites': function() {
		if (Session.get('favorites') == true)
			return "desktop-menu--list-element-selected"	
	},
	'selectedFiles': function() {
		if (Session.get('files') == true)
			return "desktop-menu--list-element-selected"	
	},
	'selectedImages': function() {
		if (Session.get('images') == true)
			return "desktop-menu--list-element-selected"	
	},
	'selectedAuthorClass': function(){
		if (this.name == Session.get('author'))
			return "desktop-menu--list-element-selected"
	},
	'selectedCategoryClass': function(){
		if (this.name == Session.get('category'))
			return "desktop-menu--list-element-selected"
	},
	'selectedTagClass': function(){
		if (this.name == Session.get('tag'))
			return "desktop-menu--list-element-selected"
	},
	'isDisabled': function(nRef) { // Add a class if element is not used (no publication related)
		if (nRef == 0)
			return "desktop-menu--list-element-disabled"
		else return null
	},
	ownSpace: function() {
		var userId = Meteor.userId();
		var isAdmin = Roles.userIsInRole(Meteor.userId(), ['admin'])
		if (userId)
			if (Template.parentData(1).space._id === userId)
				return true;
		else if (isAdmin)
			if (isAdmin === true)
				return true;
		else
			return false;
	},
});