var dateHelper = function(property) {
  return function() {
    var date = LessonsUpdated.getProperty(Router.current().route.name, property);
    if (!date) return;
    var additional;
    if (property === "date")
      additional = "<span class=\"hidden-xs\">, den " + date.getDate() + "." + (date.getMonth() + 1) + ".</span>";
    else if (property === "updated")
      additional = " um " + date.getHours() + ":" + date.getMinutes() + " Uhr";
    return ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"]
      [date.getDay()] + additional;
  };
};

Template.lessons.date = dateHelper("date");
Template.lessons.updated = dateHelper("updated");

Template.lessons.showGrid = function() {
  var view = Session.get("view");
  var showGridBasedOnWidth = $(".container").width() < 720;
  return view ? view === "grid" : showGridBasedOnWidth;
};

Template.lessons.tableSettings = function() {
  return {
    rowsPerPage: 100,
    showFilter: false,
    showNavigation: "never",
    fields: [
      { key: "period", label: "Stunde", sort: "ascending", tmpl: Template.period },
      { key: "class", label: "Klasse", tmpl: Template.class },
      { key: "absent", label: "Abwesend" },
      { key: "substitute", label: "Vertretung" },
      { key: "notice", label: "Bemerkung" },
      { key: "subject", label: "Fach" },
      { key: "room", label: "Raum" }
    ],
    rowClass: function(lesson) {
      if (Lessons.isConcerning(lesson))
        return "danger";
    }
  };
};

Template.lessons.klass = function() {
  var user = Users.findOne();
  return user ? user.class : null;
};

Template.lessons.lessonsConcerning = function() {
  var data = Router.current().data();
  return data.lessonsInClass.count() || data.lessonsInGrade.count();
};

Template.lessons.events = {
  "click .grid-btn": function() {
    Session.set("view", "grid");
  },

  "click .table-btn": function() {
    Session.set("view", "table");
  },

  "click .lesson": function() {
    if (Template.grid.isActive.apply(this))
      Session.set("activeLesson", null);
    else
      Session.set("activeLesson", Lessons.getIdentifier(this));
  },

  "submit form.class": function(e) {
    e.preventDefault();
    var klass = $("#class").val();
    Meteor.call("setClass", klass);
  }
};

Template.grid.isActive = function() {
  return Session.get("activeLesson") == Lessons.getIdentifier(this);
};

Template.grid.panelStyle = function() {
  var defaultStyle = "panel-default";
  var activeStyle = "panel-primary";
  if (Lessons.isConcerning(this))
    defaultStyle = activeStyle = "panel-danger";
  return Template.grid.isActive.apply(this) ? (activeStyle + " active") : defaultStyle;
};