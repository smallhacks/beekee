Spaces = new Mongo.Collection('spaces');

Spaces.allow({

	//update: function(userId, space) { return true},
	//remove: function(userId, space) { return true},

	insert: function(userId, space) { return ownsDocument(userId, space) || isAdmin(userId); },

	update: function(userId, space) { return ownsDocument(userId, space) || isAdmin(userId); },

	remove: function(userId, space) { return ownsDocument(userId, space) || isAdmin(userId); }
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


	Spaces.before.remove(function (userId, doc) {

		var spaceId = doc._id;
		Posts.remove({spaceId:spaceId});
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
			//Posts.remove({spaceId:spaceId},{multi:true});
		},
		deleteSpaces: function(userId) {

			Spaces.remove({userId:userId});

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
				createUserAllowed:true,
				liveFeed:true,
				lessons:false,
				resources:true,
				liveFeedComments:true,
				permissions:{public:false, liveFeedAddPost:true}
			});

			var spaceId = Spaces.insert(space);

			Meteor.call('authorInsert', 'Invité', spaceId );

			// Insert welcome post
			Posts.insert({spaceId:spaceId, type:"home", order:0, submitted: Date.now(),title: "Welcome!", body:"<p><em>Spaces</em> in Beekee are ideal for real-time interactions using the <strong>Live Feed</strong>, hosting training content in <strong>Lessons</strong> (if enabled) and sharing files with your learners in <strong>Resources</strong>.</p>\n<p>This is the Home page of your space. Right now it is empty but feel free to edit (or delete) this post to start.</p>\n<p>----------------------</p>\n<p>Les <em>Espaces</em>&nbsp;dans Beekee sont le lieu id&eacute;al pour&nbsp;interagir en temps r&eacute;el en utilisant&nbsp;<strong>Direct</strong>,&nbsp;proposer du contenu d'apprentissage dans&nbsp;<strong>Le&ccedil;ons</strong> (si activ&eacute;) et partager des fichiers avec vos apprenants dans&nbsp;<strong>Ressources</strong>.</p>\n<p>Ceci est la page d'accueil de votre espace. Pour l'instant, elle est vide, mais sentez-vous libre de modifier (ou de supprimer) ce post pour d&eacute;buter.</p>"});

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