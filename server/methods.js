Meteor.methods({
  loginWithMoodleCredentials: function(username, password) {
    if (this.userId)
      throw new Meteor.Error(403, "Already logged in");
    var moodleSession = LessonController.moodleLogin(username, password);
    user = Users.findOne({ username: username });
    if (user) {
      if (user.session) {
        moodleSession = user.session;
      } else
        Users.update(user._id, { $set: {
          session: moodleSession,
          loggedIn: new Date(),
          admin: user.username === Meteor.settings.adminUsername
        } });
    } else
      Users.insert({
        username: username,
        session: moodleSession,
        loggedIn: new Date(),
        admin: username === Meteor.settings.adminUsername
      });
    this.setUserId(moodleSession);
    return moodleSession;
  },

  loginWithMoodleSession: function(moodleSession) {
    if (!moodleSession)
      throw new Meteor.Error(401, "Please do not try to cheat. Thank you.");
    if (this.userId)
      throw new Meteor.Error(403, "Already logged in");
    var user = Users.findOne({ session: moodleSession });
    if (!user)
      throw new Meteor.Error(401, "Session invalid");
    this.setUserId(moodleSession);
  },

  logout: function() {
    if (!this.userId)
      throw new Meteor.Error(403, "Not logged in");
    Users.update({ session: this.userId }, { $unset: { session: true } });
    this.setUserId(null);
  },

  setClass: function(klass) {
    if (!this.userId)
      throw new Meteor.Error(403, "Not logged in");
    Users.update({ session: this.userId }, { $set: { class: klass } });
  },

  refresh: function(enabled) {
    if (!this.userId)
      throw new Meteor.Error(403, "Not logged in");
    if (!Users.findOne({ session: this.userId, admin: true }))
      throw new Meteor.Error(403, "Admin required");
    if (enabled === undefined)
      enabled = true;
    if (enabled)
      LessonController.startScheduling();
    else
      LessonController.stopScheduling();
  },

  getUsers: function() {
    if (!this.userId)
      throw new Meteor.Error(403, "Not logged in");
    if (!Users.findOne({ session: this.userId, admin: true }))
      throw new Meteor.Error(403, "Admin required");
    return Users.find().fetch();
  }
});