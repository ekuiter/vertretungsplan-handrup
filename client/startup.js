var startup = function() {
  Users.tryToLoginWithMoodleSession(true);

  Meteor.connection.onReconnect = function() {
    Users.tryToLoginWithMoodleSession();
  };
};

Meteor.startup(function() {
  if (Meteor.isCordova)
    document.addEventListener("deviceready", startup);
  else
    startup();
});