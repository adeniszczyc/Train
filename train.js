if (Meteor.isClient) {
  Template.home.events({

  });

  Template.home.created = function() {
	  Meteor.Loader.loadJs("https://maps.googleapis.com/maps/api/js?key=AIzaSyBVrZhSoNT6AExUh70_sHNSUzenFi8wHKM&libraries=geometry,places&callback=init");
  };
  Template.home.rendered = function() {

  }

}


Router.route('/', function () {
  this.render('home');
});

Router.route('/items');

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
