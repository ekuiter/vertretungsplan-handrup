Lessons = new Meteor.Collection("lessons");

Lessons.getIdentifier = function(lesson) {
  return [lesson.type, lesson.period, lesson.class, lesson.absent,
    lesson.substitute, lesson.notice, lesson.subject, lesson.room].join();
};

Lessons.isConcerning = function(lesson) {
  return lesson.class === Users.getClass() || lesson.class === Users.getGrade();
};