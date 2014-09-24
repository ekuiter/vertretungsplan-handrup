Users = new Meteor.Collection("users");

Users.setMoodleSession = function(moodleSession) {
  window.localStorage.setItem("moodleSession", moodleSession);
  Session.set("loggedIn", true);
};

Users.tryToLoginWithMoodleSession = function() {
  if (moodleSession = window.localStorage.getItem("moodleSession")) {
    Meteor.call("loginWithMoodleSession", moodleSession, function(err) {
      if (err)
        console.log(err);
      else
        Session.set("loggedIn", true);
    });
  }
};

Users.logout = function() {
  Meteor.call("logout", function(err) {
    if (err)
      console.log(err);
  });
  window.localStorage.removeItem("moodleSession");
  Session.set("loggedIn", false);
};

Users.getClass = function() {
  var user = Users.findOne();
  if (user && user.class)
    return user.class.match(/[a-zA-Z]/) ? user.class : null;
  else
    return null;
};

Users.getGrade = function() {
  var user = Users.findOne();
  return user && user.class ? user.class.replace(/[a-zA-Z]/, "") : null;
};