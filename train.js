Routes = new Mongo.Collection("routes");

if (Meteor.isClient) {
  Template.home.events ({
  });

  Template.home.helpers({
    routes: function() {
      return Routes.find({});
    },
    places: function() {
      return Session.get('places');
    }
    
  });

  Template.home.helpers({
    routeInfo: function() {
      return Session.get('routeInfo');
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

  Template.submenu.rendered = function() {
  
    var bars = $('#bars');

    $("#submenu").removeClass("hidden");
                  

    var rating = bars.attr("rating");
    console.log(rating);
    $("#bars option:nth-child(" + rating + ")").attr("selected", "selected");
    
    
    bars.barrating({
        theme: 'bars-movie'
    });

  }


  Template.home.events({
    "submit .new-route": function (event) {


      event.preventDefault();

      // Get value from form element
      var from = event.target.from.value;
      var to = event.target.to.value;
      var rating = event.target.rating.value;

  
      $("#saveRoute").attr("value", "Saved");
      $("#saveRoute").attr("disabled", "true");

      // Insert a task into the collection

      from = from.toLowerCase();
      to = to.toLowerCase();

      var route = Routes.findOne({
        from: from,
        to: to
      });


      if (typeof route === 'undefined') {
        Routes.insert({
          from: from,
          to: to,
          rating: [rating],
          averageRating: rating
        });
      }
      else {
        var data_rating = route.rating;
        var average_rating = Math.ceil(sum / rating.length);
        
        data_rating.push(rating);
        
        var sum = rating.reduce(function(prev, current) {
            return parseInt(prev) + parseInt(current);
         });
        
        var average_rating = Math.ceil(sum / data_rating.length);


        Routes.update({
          _id: route._id
        }, {
          $set: {rating: data_rating,
                 averageRating: average_rating}
        });
      }



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
