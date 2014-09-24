LessonsUpdated = new Meteor.Collection("lessonsUpdated");

LessonsUpdated.get = function(lessonsType) {
  return this.find({ type: lessonsType });
};

LessonsUpdated.getProperty = function(lessonsType, property) {
  lessonsUpdated = this.get(lessonsType).fetch()[0];
  return lessonsUpdated ? lessonsUpdated[property] : null;
};

LessonsUpdated.set = function(lessonsType, date, updated) {
  this.upsert({ type: lessonsType }, {
    type: lessonsType,
    date: date,
    updated: updated
  });
};