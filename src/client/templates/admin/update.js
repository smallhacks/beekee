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

		Session.set("fileId",fileInfo.fileId);
		Session.set("fileName",fileInfo.fileName);
		Session.set("fileExt",fileInfo.fileExt);
		Session.set("filePath",fileInfo.path);
	}
});


Template.update.events({

	'click .update--retry': function(e) {
		e.preventDefault();
		Session.set("fileId",null); // Clear fileId session
		Session.set("fileName",null); // Clear fileId session
		Session.set("fileExt",null); // Clear fileId session
		Session.set("filePath",null); // Clear fileId session
	},
	'click .update--reboot': function(e) {
		e.preventDefault();

		Meteor.call('shutdownBox', function(error, result){
			if (error) {
				alert(TAPi18n.__('error-message')+error.message);
			}
			else {
				alert(TAPi18n.__('index-teacher--shutdown-confirm'));
			}
		});
	}
});


Template.update.helpers({

	updateUploaded: function() {
		if (Session.get("fileId")) {
			var fileId = Session.get("fileId");

			// Wait until file is in Files collection
			var fileInCollection = Files.findOne({_id:fileId});
			return fileInCollection;
		}
		else
			return false;
	}
});


