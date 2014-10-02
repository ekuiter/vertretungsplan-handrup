Template.layout.events({
  "click .disconnected button": function() {
    Meteor.reconnect();
  }
});

Template.disconnected.isDisconnected = function() {
  return !Meteor.status().connected;
};

Template.tryingToLogin.isTryingToLogin = function() {
  return Session.get("tryingToLogin");
};