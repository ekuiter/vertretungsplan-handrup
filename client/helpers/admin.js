Template.admin.users = function() {
  return Session.get("adminUsers");
};

Template.admin.tableSettings = function() {
  return {
    rowsPerPage: 10000,
    showFilter: true,
    showNavigation: "never",
    fields: [
      { key: "username", label: "Benutzername", tmpl: Template.username },
      { key: "class", label: "Klasse" },
      { key: "session", label: "Moodle Session" },
      { key: "loggedIn", label: "Zuletzt angemeldet", sort: "descending", tmpl: Template.loggedIn },
      { key: "admin", label: "Admin", tmpl: Template.adminColumn }
    ]
  };
};

Template.admin.isAdmin = function() {
  return Users.isAdmin();
};

var buttonClassFunc = function(selector) {
  return function(err) {
    if (err)
      $(selector).addClass("btn-danger");
    else
      $(selector).addClass("btn-success");
  };
};

Template.admin.events({
  "click .users": function() {
    $(".users").removeClass("btn-danger btn-success");
    Users.adminUsers(buttonClassFunc(".users"));
  },

  "click .lessons": function() {
    $(".lessons").removeClass("btn-danger btn-success");
    Meteor.call("refresh", buttonClassFunc(".lessons"));
  },

  "click .lessons-stop": function() {
    $(".lessons-stop").removeClass("btn-danger btn-success");
    Meteor.call("refresh", false, buttonClassFunc(".lessons-stop"));
  }
});

Template.loggedIn.loggedInHelper = function() {
  var date = this.loggedIn;
  if (date)
    return "am " + date.getDate() + "." + (date.getMonth() + 1) +
      ". um " + date.getHours() + ":" + date.getMinutes() + " Uhr";
};