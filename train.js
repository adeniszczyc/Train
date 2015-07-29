if (Meteor.isClient) {
  Template.home.events ({
  });

  Template.home.created = function() {
    Meteor.Loader.loadJs("https://maps.googleapis.com/maps/api/js?key=AIzaSyBVrZhSoNT6AExUh70_sHNSUzenFi8wHKM&libraries=geometry,places&callback=init");
  };
  Template.home.isFirstRun = function(){
     // because the Session variable will most probably be undefined the first time
     return !Session.get("hasRun");
  }
  Template.home.rendered = function() {

    var template = this;

    slideoutInstance = new Slideout({
      'menu': template.$(".menu").get(0),
      'panel': template.$(".panel").get(0),
      'padding': window.innerWidth * 0.8,
      'tolerance': 70,
      'side': "right"
    });
    // Toggle button
    document.querySelector('.toggle-button').addEventListener('click', function() {
      slideoutInstance.toggle();
    });
  }

}


Router.route('/', function() {
  this.render('home');
});

Router.route('/items');

if (Meteor.isServer) {
  Meteor.startup(function() {
    // code to run on server at startup
  });
}
