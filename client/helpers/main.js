Template.layout.disconnected = function() {
  return !Meteor.status().connected;
};

Template.layout.events({
  "click .disconnected button": function() {
    Meteor.reconnect();
  }
});