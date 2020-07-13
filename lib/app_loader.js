if (Meteor.isServer) {
	Inject.rawHead("metaLoader", '<meta name="viewport" content="initial-scale=1.0, user-scalable=0, width=device-width, height=device-height"/><meta name="apple-mobile-web-app-capable" content="yes">	<meta name="mobile-web-app-capable" content="yes">');

	Inject.rawBody("htmlLoader", Assets.getText('app_loader.html'));
}

if (Meteor.isClient) {
	Meteor.startup(function() {
		setTimeout(function() {
			$("#inject-loader-wrapper").fadeOut(500, function() { $(this).remove(); });
		}, 700);
	});
}