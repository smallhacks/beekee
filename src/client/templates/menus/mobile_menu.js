Template.slideoutMenu.events({

	'click .slideout-menu--exit': function(e){
		e.preventDefault();
		Router.go('spaceList');
	},
	'click .slideout-menu--settings': function(e,template){
		e.preventDefault();
		Router.go('spaceEdit',{_id: template.data.space._id});
	},
	'click .slideout-menu--show-all': function(e) {
		e.preventDefault();
		resetFilters();
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
		favorites = Session.get(Template.parentData(2).space._id).favorites;
		Session.set('postsServerNonReactive', favorites.length);
		resetPostInterval();
	}
});


Template.slideoutMenu.helpers({

	postCount: function() {
		var count = Counts.findOne();
		return count && count.count;
	},
	pinnedCount: function() {
		var pinnedCount = PinnedCounts.findOne();
		return pinnedCount && pinnedCount.count;
	},
	favoritesCount: function() {
		var favorites = Session.get(Template.parentData(2).space._id).favorites;
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
	'selectedShowAll': function() {
		if (Session.get('author') == '' && Session.get('category') == '' && Session.get('tag') == '' && Session.get('favorites') == false && Session.get('pinned') == false && Session.get('files') == false && Session.get('images') == false)
			return "slideout-menu--list-element-selected"	
	},
	'selectedPinned': function() {
		if (Session.get('pinned') == true)
			return "slideout-menu--list-element-selected"	
	},
	'selectedFavorites': function() {
		if (Session.get('favorites') == true)
			return "slideout-menu--list-element-selected"	
	},
	'selectedFiles': function() {
		if (Session.get('files') == true)
			return "slideout-menu--list-element-selected"	
	},
	'selectedImages': function() {
		if (Session.get('images') == true)
			return "slideout-menu--list-element-selected"	
	},
	'selectedAuthorClass': function(){
		if (this.name == Session.get('author'))
			return "slideout-menu--list-element-selected"
	},
	'selectedCategoryClass': function(){
		if (this.name == Session.get('category'))
			return "slideout-menu--list-element-selected"
	},
	'selectedTagClass': function(){
		if (this.name == Session.get('tag'))
			return "slideout-menu--list-element-selected"
	},
	'isDisabled': function(nRef) {
		if (nRef == 0)
			return "slideout-menu--list-element-disabled"
		else return null
	},
	ownSpace: function() {
		var userId = Meteor.userId();
		var isAdmin = Roles.userIsInRole(Meteor.userId(), ['admin'])
		if (userId && this.space)
			if (this.space.userId === userId)
				return true;
		else if (isAdmin)
			if (isAdmin === true)
				return true;
		else
			return false;
	}
	// ownSpace: function() {
	// 	if (this.space.userId === Meteor.userId() || Roles.userIsInRole(Meteor.userId(), ['admin']) === true) 
	// 		return true;
	// }   	
});