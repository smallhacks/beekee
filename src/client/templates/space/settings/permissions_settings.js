Template.permissionsSettings.events({
 
	'click .permissions-settings--addCategories': function(e) {
		e.preventDefault();
	
		if (this.space.permissions)
			if (this.space.permissions.addCategories) {
				Spaces.update(this.space._id, {$set: {permissions:{addCategories:false}}}, function(error) {
					if (error)
						alert(TAPi18n.__('error-message')+error.message);
				});
			}
			else {
				Spaces.update(this.space._id, {$set: {permissions:{addCategories:true}}}, function(error) {
					if (error)
						alert(TAPi18n.__('error-message')+error.message);
				});				
			}
		else
			Spaces.update(this.space._id, {$set: {permissions:{addCategories:true}}}, function(error) {
				if (error)
					alert(TAPi18n.__('error-message')+error.message);
			});
	}
}); 