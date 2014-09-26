Template.login.errorMessage = function() {
  return Session.get("errorMessage");
};

Template.login.loginFailedStyle = function() {
  return Session.get("errorMessage") ? "has-error" : "";
}

Template.login.events({
  "submit form.login": function(e) {
    e.preventDefault();
    var username = $("#username").val();
    var password = $("#password").val();

    Meteor.call("loginWithMoodleCredentials", username, password, function(err, res) {
      if (err && err.reason === "Username or password invalid")
        Session.set("errorMessage", "Benutzername oder Passwort falsch.");
      else if (err)
        Session.set("errorMessage", err.reason);
      else {
        Session.set("errorMessage", null);
        Users.setMoodleSession(res);
      }
    });
  }
});