import { Template } from 'meteor/templating';

import './back_header.html';


Template.backHeader.events({
	
	'click .back-header--button-back': function(e) {
		e.preventDefault();
		history.back();
  	}
});