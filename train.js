if (Meteor.isClient) {
  
  Router.route('/', function () {
    this.render('home');
  });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
