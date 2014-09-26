Users = new Meteor.Collection("users");

Users.setMoodleSession = function(moodleSession) {
  window.localStorage.setItem("moodleSession", moodleSession);
};

Users.tryToLoginWithMoodleSession = function(startup) {
  if (Users.tryingToLogin)
    return;
  if (startup)
    Users.tryingToLogin = true;
  if (moodleSession = window.localStorage.getItem("moodleSession")) {
    Meteor.call("loginWithMoodleSession", moodleSession, function(err) {
      if (err && err.reason === "Session invalid")
        window.localStorage.removeItem("moodleSession");
      else if (err)
        console.log(err);
      Users.tryingToLogin = false;
    });
  }
};

Users.loggedIn = function() {
  return Users.findOne();
};

Users.logout = function() {
  Meteor.call("logout", function(err) {
    if (err)
      console.log(err);
  });
  window.localStorage.removeItem("moodleSession");
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