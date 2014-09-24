Meteor.publish("lessons", function(lessonsType) {
  if (!this.userId)
    return [];
  return Lessons.find({ type: lessonsType });
});

Meteor.publish("lessonsUpdated", function(lessonsType) {
  if (!this.userId)
    return [];
  return LessonsUpdated.find({ type: lessonsType });
});

Meteor.publish("user", function() {
  if (!this.userId)
    return [];
  return Users.find({ session: this.userId });
});