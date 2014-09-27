Meteor.methods({
  logout: function() {
    Users.update({ session: Users.getMoodleSession() }, { $unset: { session: true } });
  },

  setClass: function(klass) {
    Users.update({ session: Users.getMoodleSession() }, { $set: { class: klass } });
  }
});