Meteor.startup(function() {
  Users.tryToLoginWithMoodleSession(true);

  Meteor.connection.onReconnect = function() {
    Users.tryToLoginWithMoodleSession();
  };
});