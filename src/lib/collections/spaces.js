// Copyright 2016-2020 UNIVERSITY OF GENEVA (GENEVA, SWITZERLAND)

// This file is part of Beekee Live.
    
// Beekee Live is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Beekee Live is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
//  along with Beekee Live.  If not, see <https://www.gnu.org/licenses/>.

//**************************************************************************


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
					title: String,
					lang: String
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
				permissions:{public:false, liveFeedAddPost:true, liveFeedAddCategory:false}
			});

			var spaceId = Spaces.insert(space);

			Meteor.call('authorInsert', 'Invité', spaceId );

			// Insert welcome post
			if (spaceAttributes.lang == "fr-FR" || spaceAttributes.lang == "fr")
				Posts.insert({spaceId:spaceId, type:"home", order:0, submitted: Date.now(),title: "Bienvenue dans votre nouvel espace Beekee Live !", body:"<p>Beekee Live est l'outil idéal pour soutenir les interactions en temps réel, pour partager des photos ou des fichiers avec vos étudiants.</p>\n<p>Ce message est visible par vos étudiants : sentez-vous libre de le modifier (ou de le supprimer) pour communiquer avec eux.</p>"});
			else
				Posts.insert({spaceId:spaceId, type:"home", order:0, submitted: Date.now(),title: "Welcome to your new Beekee Live space!", body:"<p>Beekee Live is ideal for real-time interactions and to share pictures or files with your learners.</p>\n<p>This message will be visibile for everyone: feel free to edit (or delete ) it according to your needs.</p>"});

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