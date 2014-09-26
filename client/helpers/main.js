Template.layout.events({
  "click .disconnected button": function() {
    Meteor.reconnect();
  }
});

Template.disconnected.isDisconnected = function() {
  return !Meteor.status().connected;
};