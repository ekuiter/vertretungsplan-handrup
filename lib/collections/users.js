Users = new Meteor.Collection("users");

Users.getMoodleSession = function(cb) {
  if (!cb)
    throw new Error("no callback provided");
  if (Meteor.isCordova)
    Cordova.readFile(cordova.file.applicationStorageDirectory + "Documents/meteor/", "moodleSession", function(err, res) {
      if (err)
        console.log(err);
      else
        cb(res === "null" ? null : res);
    });
  else
    cb(window.localStorage.getItem("moodleSession"));
};

Users.setMoodleSession = function(moodleSession) {
  if (Meteor.isCordova)
    Cordova.writeFile(cordova.file.applicationStorageDirectory + "Documents/meteor/", "moodleSession", moodleSession, function(err, res) {
      if (err)
        console.log(err);
    });
  else {
    if (moodleSession)
      window.localStorage.setItem("moodleSession", moodleSession);
    else
      window.localStorage.removeItem("moodleSession");
  }
};

Users.tryToLoginWithMoodleSession = function(startup) {
  if (Users.tryingToLogin)
    return;
  if (startup)
    Users.tryingToLogin = true;
  Users.getMoodleSession(function(moodleSession) {
    if (moodleSession) {
      Meteor.call("loginWithMoodleSession", moodleSession, function(err) {
        if (err && err.reason === "Session invalid")
          Users.setMoodleSession(null);
        else if (err)
          console.log(err);
        Users.tryingToLogin = false;
      });
    }
  });
};

Users.loggedIn = function() {
  return Users.findOne();
};

Users.logout = function() {
  Meteor.call("logout", function(err) {
    if (err)
      console.log(err);
  });
  Users.setMoodleSession(null);
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