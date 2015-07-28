if (Meteor.isClient) {
  Template.home.events({
    
  });
  Template.home.rendered = function() {

  }
}
Router.route('/', function () {
  this.render('home');
});
  // code to create new url
  Router.route('/items');
if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
