Template.login.loginFailed = function() {
  return Session.get("loginFailed");
};

Template.login.loginFailedStyle = function() {
  return Session.get("loginFailed") ? "has-error" : "";
}

Template.login.events({
  "submit form.login": function(e) {
    e.preventDefault();
    var username = $("#username").val();
    var password = $("#password").val();

    Meteor.call("loginWithMoodleCredentials", username, password, function(err, res) {
      if (err)
        Session.set("loginFailed", true);
      else {
        Session.set("loginFailed", false);
        Users.setMoodleSession(res);
      }
    });
  }
});