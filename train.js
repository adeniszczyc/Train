if (Meteor.isClient) {

	Template.home.created = function() {
	  Meteor.Loader.loadJs("https://maps.googleapis.com/maps/api/js?key=AIzaSyBVrZhSoNT6AExUh70_sHNSUzenFi8wHKM&libraries=geometry,places&callback=init");
	};

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
