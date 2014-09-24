Template.setClass.grades = function() {
  var grades = [""];
  for (var i = 5; i <= Meteor.settings.public.grades; i++)
    grades.push(i.toString());
  return grades;
};

Template.setClass.gradeSelected = function() {
  return Users.getGrade() === this.toString() ? "selected" : null;
};

Template.setClass.classes = function() {
  return Meteor.settings.public.classes;
};

Template.setClass.classSelected = function() {
  var klass = Users.getClass();
  if (Users.getGrade() > 10 && !klass && this.toString() === "(TG)")
    return "selected";
  return klass && klass.replace(/\d*/, "") === this.toString() ? "selected" : null;
};

Template.setClass.events({
  "submit form.class": function(e) {
    e.preventDefault();
    var grade = $("#grade").val();
    var klass = $("#class").val();
    Meteor.call("setClass", grade + klass.replace("(TG)", ""));
    Router.go("today");
  }
});