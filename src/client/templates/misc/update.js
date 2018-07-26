Template.update.onCreated(function() {

		if (Session.get("fileId"))
			delete Session.keys["fileId"]; // Clear fileId session

		if (Session.get("fileExt"))
			delete Session.keys["fileExt"]; // Clear fileExt session
});


Template.update.onRendered(function() {

	Deps.autorun(function() { // Autorun to reactively update subscription of file
		if (Session.get("fileId"))
			Meteor.subscribe('file', Session.get("fileId"));
	});

	Uploader.finished = function(index, fileInfo, templateContext) { // Triggered when file upload is finished
	// TODO : don't upload file before submit post (or remove after if post isn't submitted)	
	
		var fileName = fileInfo.name.substr(0, fileInfo.name.lastIndexOf('.')) || fileInfo.name;
		var fileExt = fileInfo.name.substr(fileInfo.name.lastIndexOf('.')+1).toLowerCase();

		Session.set("fileId",fileName);
		Session.set("fileExt",fileExt);
	}
});


Template.update.events({

	'click .update--upload': function(e) {
		e.preventDefault();

		if (confirm(TAPi18n.__('space-edit--delete-space-message'))) {
			Meteor.call('deleteSpace', this._id, function(error) {
				if (error)
					alert(TAPi18n.__('error-message')+error.message);
				else {
					alert(TAPi18n.__('space-edit--delete-space-confirm-message'));
				}
			});
		}
	}
});


Template.update.helpers({
	updateUploaded: function() {
		if (Session.get("fileId")) {
			var fileId = Session.get("fileId");

			// Wait until file is in Files collection
			var fileInCollection = Files.findOne({fileId:fileId});
			return fileInCollection;
		}
		else
			return false;
	},
	beekeeVersion: function() {
		Meteor.call('getBeekeeVersion', function(error, result){
			if (error) {
				Session.set('beekeeVersion',error);
			}
			else {
				Session.set('beekeeVersion',result);
			}
		});
		return Session.get('beekeeVersion');
	}
});


