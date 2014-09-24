Meteor.startup(function() {
  Users.tryToLoginWithMoodleSession();

  Meteor.connection.onReconnect = function() {
    Users.tryToLoginWithMoodleSession();
  };
});