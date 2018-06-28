Spaces = new Mongo.Collection('spaces');

Spaces.allow({

	update: function(userId, space) { return true},
	remove: function(userId, space) { return true}


	// update: function(userId, space) { return ownsDocument(userId, space) || isAdmin(userId); },

	// remove: function(userId, space) { return ownsDocument(userId, space) || isAdmin(userId); }
});


if(Meteor.isServer) {

	Spaces.before.update(function (userId, doc, fieldNames, modifier, options) {

		modifier.$set = modifier.$set || {};
		modifier.$set.modified = Date.now();

		// change modified date
		doc.version =  doc.version++;
		doc.modified = Date.now();
	});

	Spaces.before.insert(function (userId, doc) {
		// change modified date
		doc.submitted =  Date.now();
	});


	Meteor.methods({

		getSpaceId: function(spaceCode) {
			if (Spaces.findOne({spaceCode:spaceCode}))
				return Spaces.findOne({spaceCode:spaceCode})._id;
			else
				return null;
		},
		updateCode: function(oldCode, newCode) {
			var codeId = Codes.findOne({code: oldCode})._id;
			Codes.update(codeId,{code:newCode}, function(error) {
				if (error) {
					console.log("Error when changing code : "+error.message);
				}
				else {
					console.log("Code has been changed.");
				}
			})
		},
		deleteSpace: function(spaceId) {
				Spaces.remove(spaceId);
				Posts.remove({spaceId:spaceId});
		},
		spaceInsert: function(spaceAttributes) {

			check(spaceAttributes, {
					title: String
			});

			var nbOfCodes = Codes.find().count();
			var prefix = Meteor.settings.public.prefix;
			var codeLength = 4;

			if (nbOfCodes <= 1000)
				codeLength = 2;
			else if (nbOfCodes > 1000 && nbOfCodes <= 100000)
				codeLength = 3;
			else if (nbOfCodes > 100000 && nbOfCodes <= 10000000)
				codeLength = 4;

			var code = prefix + makeCode(codeLength);
			while (typeof Codes.findOne({code: code}) != 'undefined')
				code = prefix + makeCode(codeLength);

			Codes.insert({code:code, userId:Meteor.userId()});

			var user = Meteor.user();
			var space = _.extend(spaceAttributes, {
				userId: user._id,
				spaceCode: code,
				submitted: new Date(),
				visible: true,
				codePanel: true,
				guestWrite: true,
				commentsAllowed:true,
				postEditPermissions:"own",
				createUserAllowed:true,
				permissions:{}
			});

			var spaceId = Spaces.insert(space);

			Meteor.call('authorInsert', 'Invité', spaceId );

			return { _id: spaceId };
		}
	});
}


function makeCode(length)
{
	var text = "";
	var possible = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz123456789";

	for( var i=0; i < length; i++ )
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	
	return text;
}