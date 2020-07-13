import { Meteor } from 'meteor/meteor';

import '../server/fixtures.js';
import '../server/publications.js';
import '../server/uploads.js';
import '../server/permissions.js';
import '../lib/app_loader.js';
import '../imports/api/users.js';


Meteor.startup(() => {
  // code to run on server at startup

	// Connect Accounts to remote App
	//Meteor.connection = DDP.connect('http://beekee.box:80');
	// Remote = DDP.connect('http://beekee.box:80');
	// Accounts.connection = Remote;
	// Meteor.users = new Mongo.Collection('users', Remote);
	//  Accounts.connection.subscribe('users');
// __meteor_runtime_config__.ACCOUNTS_CONNECTION_URL = 'http://beekee.box:80';

// var connection = DDP.connect("http://beekee.box:80");
// Accounts.connection = connection;
// Meteor.users = new Mongo.Collection("users", {connection: connection});

});
