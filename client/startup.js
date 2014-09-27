Meteor.startup(function() {
  Users.tryToLoginWithMoodleSession(true);

  Meteor.connection.onReconnect = function() {
    Users.tryToLoginWithMoodleSession();
  };

  if (Meteor.isCordova) {
    document.addEventListener("deviceready", function() {
      navigator.splashscreen.hide();

      document.addEventListener("backbutton", function() {
        if (Router.current().route.name === "today")
          navigator.app.exitApp();
        else
          navigator.app.backHistory();
      }, false);
    }, false);
  }
});