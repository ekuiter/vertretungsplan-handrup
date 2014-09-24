Meteor.startup(function() {
  if (_.isEmpty(Meteor.settings))
    throw new Error("Run Meteor with --settings option");
  LessonController.startScheduling();
});