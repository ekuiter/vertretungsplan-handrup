Users = new Meteor.Collection("users");

var moodleSessionDirectory = function() {
  return cordova.file.applicationStorageDirectory + "Documents/meteor/";
};

Users._getMoodleSessionCordova = function(cb) {
  Cordova.readFile(moodleSessionDirectory(), "moodleSession", function(err, res) {
    if (err) {
      console.log(err);
      cb(null);
    } else
      cb(res === "null" ? null : res);
  });
};

Users._setMoodleSessionCordova = function(moodleSession) {
  Cordova.writeFile(moodleSessionDirectory(), "moodleSession", moodleSession, function(err) {
    if (err)
      console.log(err);
  });
};

Users.getMoodleSession = function(cb) {
  if (!cb)
    throw new Error("no callback provided");
  var moodleSession = window.localStorage.getItem("moodleSession");
  if (Meteor.isCordova && !moodleSession)
    Users._getMoodleSessionCordova(cb);
  else
    cb(moodleSession);
};

Users.setMoodleSession = function(moodleSession) {
  if (moodleSession)
    window.localStorage.setItem("moodleSession", moodleSession);
  else
    window.localStorage.removeItem("moodleSession");
  if (Meteor.isCordova)
    Users._setMoodleSessionCordova(moodleSession);
};

Users.setTryingToLogin = function(tryingToLogin) {
  Session.set("tryingToLogin", tryingToLogin);
  Users._tryingToLogin = tryingToLogin;
};

Users.tryToLoginWithMoodleSession = function(startup) {
  if (Users._tryingToLogin)
    return;
  if (startup)
    Users.setTryingToLogin(true);
  Users.getMoodleSession(function(moodleSession) {
    if (moodleSession) {
      Meteor.call("loginWithMoodleSession", moodleSession, function(err) {
        if (err && err.reason === "Session invalid")
          Users.setMoodleSession(null);
        else if (err)
          console.log(err);
        Users.setTryingToLogin(false);
      });
    } else
      Users.setTryingToLogin(false);
  });
};

Users.loggedIn = function() {
  return Users.findOne();
};

Users.isAdmin = function() {
  var user = Users.findOne();
  return user && user.admin;
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

Users.adminUsers = function(cb) {
  cb = cb || function() { };
  Meteor.call("getUsers", function(err, res) {
    Session.set("adminUsers", res);
    cb(err);
  });
};