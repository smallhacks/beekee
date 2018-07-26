// Upload files with tomitrescak:meteor-uploads

Meteor.startup(function () {


	UploadServer.init({
		tmpDir: process.env.PWD + '/.uploads/tmp',
		uploadDir: process.env.PWD + '/.uploads',
		checkCreateDirectories: true,
		getDirectory: function(fileInfo, formData) {

			var spaceId = formData.spaceId;
			fileInfo.spaceId = spaceId;

			var newID = new Mongo.ObjectID(); // Manually generate a new Mongo id
			var fileId = newID._str;
			fileInfo.fileId = fileId;

			if (formData.type == 'liveFeed') {
				console.log("Uploading a liveFeed file...");
				return '/'+spaceId+'/liveFeed/'+fileId;
			}
			else if (formData.type == 'resource') {
				console.log("Uploading a resource...");
				return '/'+spaceId+'/resource/'+fileId;
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

			var fileExt = fileInfo.name.substr(fileInfo.name.lastIndexOf('.')+1).toLowerCase();
			fileInfo.fileExt = fileExt;


			if (formFields.type == 'liveFeed' || formFields.type == 'resource') {
				if (fileExt == "jpg" || fileExt == "jpeg" || fileExt == "png") {
					// Resize and auto-orient uploaded images with GraphicMagicks
					gm(process.env.PWD+'/.uploads/'+fileInfo.path).autoOrient().resize('1200','1200').write(process.env.PWD+'/.uploads/'+fileInfo.path,Meteor.bindEnvironment(function (error, result) {
						if (error) {
							console.log("Error when resizing :"+error)
						} else {
							Files.insert({_id: fileInfo.fileId, fileName:fileName, fileExt:fileExt, filePath: fileInfo.path});
						}
					}));
				}
				else {
					Files.insert({_id: fileInfo.fileId, fileName:fileName, fileExt:fileExt, filePath: fileInfo.path});
				}
			}
			else if (formFields.type == 'lesson') {
				cmd = Meteor.wrapAsync(exec);
				res = cmd("unzip '"+process.env.PWD+'/.uploads'+fileInfo.path+"' -d '"+process.env.PWD+"/.uploads/"+fileInfo.spaceId+"/lesson/"+fileInfo.fileId+"'");
				res2 = cmd("rm '"+process.env.PWD+'/.uploads'+fileInfo.path+"'");
				
				Files.insert({_id: fileInfo.fileId, fileName:fileName, fileExt:fileExt, filePath: fileInfo.path})
			}
			else if (formFields.type == 'update') {
				cmd = Meteor.wrapAsync(exec);	
				res = cmd("tar zxvf '"+process.env.PWD+'/.uploads'+fileInfo.path+"' -C /beekee/bundle/");
				res2 = cmd("rm '"+process.env.PWD+'/.uploads'+fileInfo.path+"'");

				Files.insert({_id: fileInfo.fileId, fileName:fileName, fileExt:fileExt, filePath: fileInfo.path})
			}
		},
		getFileName: function(fileInfo, formFields, formData) { 

			var fileExt = fileInfo.name.substr(fileInfo.name.lastIndexOf('.')+1).toLowerCase();

			// If file is an image, set a random name
			if (fileExt == "jpg" || fileExt == "jpeg" || fileExt == "png") {
				var newName = Random.id() + '.' + fileExt;
				return newName;
			}
			else {
				var fileName = fileInfo.name;				
				//fileName = fileName.replace(/ /g,"_"); // Remove spaces
				fileName = latinize(fileName); // Remove accents
				return fileName;
			}
		},
		cacheTime: 0,
  	});
});