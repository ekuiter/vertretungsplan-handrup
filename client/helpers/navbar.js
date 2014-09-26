Template.navbar.isActive = function(routeName) {
  return Router.current().route.name == routeName ? "active" : "";
};

Template.navbar.isLoggedIn = function() {
  return Users.loggedIn();
};

Template.navbar.events({
  "click .logout": function() {
    Users.logout();
  }
});