Meteor.methods({
  logout: function() {
    Users.update({ }, { $unset: { session: true } });
  },

  setClass: function(klass) {
    Users.update({ }, { $set: { class: klass } });
  }
});