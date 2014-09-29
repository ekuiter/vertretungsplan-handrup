Router.configure({
  layoutTemplate: "layout",
  loadingTemplate: "loading"
});

Router.onBeforeAction("loading");

Router.onBeforeAction(function(pause) {
  this.render("disconnected", { to: "disconnected" });

  if (!Users.loggedIn()) {
    this.render("login");
    pause();
  }
}, { except: "login" });

Router.map(function() {
  var self = this;

  var addLessonsRoute = function(lessonsType, path, title, toggleLessons, toggleLessonsPath) {
    self.route(lessonsType, {
      path: path,
      template: "lessons",

      waitOn: function() {
        return [
          Meteor.subscribe("lessons", lessonsType),
          Meteor.subscribe("lessonsUpdated", lessonsType),
          Meteor.subscribe("user")
        ];
      },

      data: function() {
          var klass = Users.getClass();
          var grade = Users.getGrade();
          var sortOptions = { sort: { period: 1 } };
          var lessons = Lessons.find({ type: lessonsType }, sortOptions);
          var otherLessons = [];
          lessons.forEach(function(lesson) {
            if (lesson.class !== klass && lesson.class !== grade)
              otherLessons.push(lesson);
          });
          return {
            title: title,
            toggleLessons: toggleLessons,
            toggleLessonsPath: toggleLessonsPath,
            lessons: lessons,
            otherLessons: otherLessons,
            lessonsInClass: Lessons.find({ type: lessonsType, class: klass }, sortOptions),
            lessonsInGrade: Lessons.find({ type: lessonsType, class: grade }, sortOptions)
        };
      }
    });
  };

  addLessonsRoute("today", "/", "Heute", "Morgen", "tomorrow");
  addLessonsRoute("tomorrow", "/tomorrow", "Morgen", "Heute", "today");

  var waitOnUser = function() {
    return Meteor.subscribe("user");
  };

  self.route("setClass", {
    path: "class",
    template: "setClass",
    waitOn: waitOnUser
  });

  self.route("admin", {
    path: "admin",
    template: "admin",
    waitOn: waitOnUser,

    onBeforeAction: function() {
      Session.set("adminUsers", []);
      Users.adminUsers();
    }
  });
});