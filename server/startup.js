Meteor.startup(function() {
  if (_.isEmpty(Meteor.settings))
    throw new Error("Run Meteor with --settings option");
  if (Meteor.settings.refreshEnabled) {
    LessonController.refreshAllLessons();
    Meteor.setInterval(LessonController.refreshAllLessons, Meteor.settings.refreshInterval * 1000);
  }
});