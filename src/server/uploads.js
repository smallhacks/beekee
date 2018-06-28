// Upload files with tomitrescak:meteor-uploads

Meteor.startup(function () {

	UploadServer.init({
		tmpDir: process.env.PWD + '/.uploads/tmp',
		uploadDir: process.env.PWD + '/.uploads',
		checkCreateDirectories: true,
		getDirectory: function(fileInfo, formData) {
			return '/';
		},
		finished: function(fileInfo, formFields) {

			var extension = fileInfo.name.substr(fileInfo.name.lastIndexOf('.')+1).toLowerCase();

			if (extension == "jpg" || extension == "jpeg" || extension == "png") {
				// Resize and auto-orient uploaded images with GraphicMagicks
				gm(process.env.PWD+'/.uploads/'+fileInfo.name).autoOrient().resize('1200','1200').write(process.env.PWD+'/.uploads/'+fileInfo.name,Meteor.bindEnvironment(function (error, result) {
					if (error) {
						console.log("Error when resizing :"+error)
					} else {
						console.log("on insert : "+fileInfo.name);
						Files.insert({fileId:fileInfo.name, fileType:extension});
					}
				}));
			}
			else
				Files.insert({fileId:fileInfo.name, fileType:extension})
		},
		getFileName: function(fileInfo, formData) { 

			// Set a new random file name
			var extension = fileInfo.name.substr(fileInfo.name.lastIndexOf('.')+1).toLowerCase();

			if (extension == "jpg" || extension == "jpeg" || extension == "png") {
				var newName = Random.id() + '.' + extension;
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