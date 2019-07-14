// Upload files with tomitrescak:meteor-uploads

Meteor.startup(function () {

	UploadServer.init({
		tmpDir: Meteor.settings.uploadDir+'/tmp',
		uploadDir: Meteor.settings.uploadDir,
		checkCreateDirectories: true,
		getDirectory: function(fileInfo, formData) {

			var spaceId = formData.spaceId;
			fileInfo.spaceId = spaceId;

			var newID = new Mongo.ObjectID(); // Manually generate a new Mongo id
			var fileId = newID._str;
			fileInfo.fileId = fileId;

			if (formData.type == 'liveFeed') {
				console.log("Uploading a liveFeed file...");
				return '/'+spaceId+'/liveFeed/';
			}
			else if (formData.type == 'resource') {
				console.log("Uploading a resource...");
				return '/'+spaceId+'/resource/';
			}
			else if (formData.type == 'lesson') {
				console.log("Uploading lesson file...");
				return '/'+spaceId+'/lesson/'+fileId;
			}
			// TODO : add more security
			else if (formData.type == 'update') {
				console.log("Uploading update file");
				return '/updates';
			}
			return '/';
			
		},
		finished: function(fileInfo, formFields, formData) {

			var fileName = fileInfo.name.substr(0, fileInfo.name.lastIndexOf('.')) || fileInfo.name;
			fileInfo.fileName = fileName;
			//fileInfo.fileName = unescape(fileName); // Check why we unescape file name in getFileName method

			var fileExt = fileInfo.name.substr(fileInfo.name.lastIndexOf('.')+1).toLowerCase();
			fileInfo.fileExt = fileExt;

			var thumbPath = filename = fileInfo.path.replace(/(\.[\w\d_-]+)$/i, '_thumb$1');

			//var thumbPath = "/"+fileInfo.spaceId+"/livefeed/"+fileInfo.fileName+"-thumb"+"."+fileInfo.fileExt;

			// TODO get thumbPath from filePath to avoid errors based on duplicate files
			fileInfo.thumbPath = thumbPath;

			if (formFields.type == 'liveFeed' || formFields.type == 'resource') {
				if (fileExt == "jpg" || fileExt == "jpeg" || fileExt == "png") {
					// Resize and auto-orient uploaded images with GraphicMagicks
					gm(Meteor.settings.uploadDir+fileInfo.path).autoOrient().resize('1200','1200').write(Meteor.settings.uploadDir+fileInfo.path,Meteor.bindEnvironment(function (error, result) {
						if (error) {
							console.log("Error when resizing :"+error);
							var errorMessage = "An error has occured."
							Files.insert({_id: fileInfo.fileId, error:errorMessage});
						} else {
							Files.insert({_id: fileInfo.fileId, fileName:fileInfo.fileName, fileExt:fileExt, filePath: fileInfo.path, thumbPath:fileInfo.thumbPath});
							// Create a thumb
							console.log("creating a thumb... : "+fileInfo.thumbPath);
							gm(Meteor.settings.uploadDir+fileInfo.path).resize('160','160','^').write(Meteor.settings.uploadDir+fileInfo.thumbPath,Meteor.bindEnvironment(function (error, result) {console.log("error ici : "+error);}));
						}
					}));
				}
				else {
					Files.insert({_id: fileInfo.fileId, fileName:fileInfo.fileName, fileExt:fileExt, filePath: fileInfo.path});
				}
			}
			else if (formFields.type == 'lesson') {
				cmd = Meteor.wrapAsync(exec);
				res = cmd("unzip '"+Meteor.settings.uploadDir+fileInfo.path+"' -d '"+Meteor.settings.uploadDir+"/"+fileInfo.spaceId+"/lesson/"+fileInfo.fileId+"'", {maxBuffer : 1024 * 1024 * 64}, function(error,result){
					if (error) {
						console.log("Error when uploading a lesson : "+error);
						var errorMessage = "An error has occured."
						Files.insert({_id: fileInfo.fileId, error:errorMessage});
					} else {				
						Files.insert({_id: fileInfo.fileId, fileName:fileInfo.fileName, fileExt:fileExt, filePath: fileInfo.path})
					}
				});
				res2 = cmd("rm '"+Meteor.settings.uploadDir+fileInfo.path+"'");
			}
			else if (formFields.type == 'update') {
				cmd = Meteor.wrapAsync(exec);	
				res = cmd("tar zxvf '"+Meteor.settings.uploadDir+fileInfo.path+"' -C "+Meteor.settings.updateDir, {maxBuffer : 1024 * 1024 * 64}, function(error,result){
					if (error) {
						console.log("Error when uploading an update : "+error);
						var errorMessage = "An error has occured."
						Files.insert({_id: fileInfo.fileId, error:errorMessage});
					} else {				
						Files.insert({_id: fileInfo.fileId, fileName:fileInfo.fileName, fileExt:fileExt, filePath: fileInfo.path})
					}
				});
				res2 = cmd("rm '"+Meteor.settings.uploadDir+fileInfo.path+"'", {maxBuffer : 1024 * 1024 * 64},);
			}
		},
		getFileName: function(fileInfo, formFields, formData) { 

			var fileName = fileInfo.name;	

			//fileName = escape(fileName);
			// The file name is used to generate the file path, so we escape unicode characters
			// and then we unescape it in finished method to save it in human-readable text

			return fileName;
			// var fileExt = fileInfo.name.substr(fileInfo.name.lastIndexOf('.')+1).toLowerCase();

			// // If file is an image, set a random name
			// if (fileExt == "jpg" || fileExt == "jpeg" || fileExt == "png") {
			// 	var newName = Random.id() + '.' + fileExt;
			// 	return newName;
			// }
			// else {
			// 	var fileName = fileInfo.name;	

			// 	fileName = encodeURIComponent(fileName);

			// 	return fileName;
			// }
		},
		cacheTime: 0,
  	});
});