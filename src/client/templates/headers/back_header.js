Template.backHeader.events({
	
	'click .back-header--button-back': function(e) {
		e.preventDefault();
		history.back();
  	}
});