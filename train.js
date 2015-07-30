Routes = new Mongo.Collection("routes");

if (Meteor.isClient) {
  Template.home.events ({
  });

  Template.home.helpers({
    routes: function () {
      return Routes.find({});
    },
    places: function() {
      return Session.get('places');
    }
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

    console.log("Debug: Init slideout");
    slideoutInstance = new Slideout({
      'menu': template.$(".menu").get(0),
      'panel': template.$(".panel").get(0),
      'padding': window.innerWidth * 0.9,
      'tolerance': 70,
      'side': "right"
    });
    // Toggle button
    document.querySelector('.toggle-button-right').addEventListener('click', function() {
      slideoutInstance.toggle();
    });
  }

  Template.home.events({
    "submit .new-route": function (event) {


      event.preventDefault();

      // Get value from form element
      var from = event.target.from.value;
      var to = event.target.to.value;
      var rating = event.target.rating.value;

      console.log("fs");
      $("#saveRoute").attr("value", "Saved");
      $("#saveRoute").attr("disabled", "true");

      // Insert a task into the collection
      Routes.insert({
        from: from,
        to:to,
        rating:rating
      });


    }
  });

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
