Template.permissionsSettings.events({
 
 	'click .permissions-settings--need-validation': function(e) {
		e.preventDefault();
	
		if (this.space.permissions)
			if (this.space.permissions.needValidation) {
				Spaces.update(this.space._id, {$set: {"permissions.needValidation":false}}, function(error) {
					if (error)
						alert(TAPi18n.__('error-message')+error.message);
				});
			}
			else {
				Spaces.update(this.space._id, {$set: {"permissions.needValidation":true}}, function(error) {
					if (error)
						alert(TAPi18n.__('error-message')+error.message);
				});				
			}
		else
			Spaces.update(this.space._id, {$set: {"permissions.needValidation":true}}, function(error) {
				if (error)
					alert(TAPi18n.__('error-message')+error.message);
			});
	},
 	'click .permissions-settings--public': function(e) {
		e.preventDefault();
	
		if (this.space.permissions)
			if (this.space.permissions.public) {
				Spaces.update(this.space._id, {$set: {"permissions.public":false}}, function(error) {
					if (error)
						alert(TAPi18n.__('error-message')+error.message);
				});
			}
			else {
				Spaces.update(this.space._id, {$set: {"permissions.public":true}}, function(error) {
					if (error)
						alert(TAPi18n.__('error-message')+error.message);
				});				
			}
		else
			Spaces.update(this.space._id, {$set: {"permissions.public":true}}, function(error) {
				if (error)
					alert(TAPi18n.__('error-message')+error.message);
			});
	},
	'click .permissions-settings--liveFeedAddCategory': function(e) {
		e.preventDefault();
	
		if (this.space.permissions)
			if (this.space.permissions.liveFeedAddCategory) {
				Spaces.update(this.space._id, {$set: {"permissions.liveFeedAddCategory":false}}, function(error) {
					if (error)
						alert(TAPi18n.__('error-message')+error.message);
				});
			}
			else {
				Spaces.update(this.space._id, {$set: {"permissions.liveFeedAddCategory":true}}, function(error) {
					if (error)
						alert(TAPi18n.__('error-message')+error.message);
				});				
			}
		else
			Spaces.update(this.space._id, {$set: {"permissions.liveFeedAddCategory":true}}, function(error) {
				if (error)
					alert(TAPi18n.__('error-message')+error.message);
			});
	},
	'click .permissions-settings--liveFeedAddPost': function(e) {
		e.preventDefault();
	
		if (this.space.permissions)
			if (this.space.permissions.liveFeedAddPost) {
				Spaces.update(this.space._id, {$set: {"permissions.liveFeedAddPost":false}}, function(error) {
					if (error)
						alert(TAPi18n.__('error-message')+error.message);
				});
			}
			else {
				Spaces.update(this.space._id, {$set: {"permissions.liveFeedAddPost":true}}, function(error) {
					if (error)
						alert(TAPi18n.__('error-message')+error.message);
				});				
			}
		else
			Spaces.update(this.space._id, {$set: {"permissions.liveFeedAddPost":true}}, function(error) {
				if (error)
					alert(TAPi18n.__('error-message')+error.message);
			});
	},
	 	'click .permissions-settings--switch-user': function(e) {
		e.preventDefault();
	
		if (this.space.permissions)
			if (this.space.permissions.switchUser) {
				Spaces.update(this.space._id, {$set: {"permissions.switchUser":false}}, function(error) {
					if (error)
						alert(TAPi18n.__('error-message')+error.message);
				});
			}
			else {
				Spaces.update(this.space._id, {$set: {"permissions.switchUser":true}}, function(error) {
					if (error)
						alert(TAPi18n.__('error-message')+error.message);
				});				
			}
		else
			Spaces.update(this.space._id, {$set: {"permissions.switchuser":true}}, function(error) {
				if (error)
					alert(TAPi18n.__('error-message')+error.message);
			});
	}
}); 