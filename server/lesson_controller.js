var Future = Npm.require("fibers/future");
var request = Npm.require("request");
var cheerio = Meteor.npmRequire("cheerio");
var encoding = Meteor.npmRequire("encoding");

LessonController = { };

LessonController.moodleLogin = function(username, password) {
  var future = new Future();
  request({
    url: Meteor.settings.moodleLoginUrl,
    method: "POST",
    form: {
      username: username,
      password: password
    }
  }, function(err, res) {
    if (!res)
      future["return"]({ error: new Meteor.Error(500, "Server did not respond") });
    else if (res.headers.location === Meteor.settings.moodleLoginUrl)
      future["return"]({ error: new Meteor.Error(401, "Username or password invalid") });
    else {
      var moodleSession = res.headers["set-cookie"][0].replace("MoodleSession=", "").split(";")[0];
      console.log("Moodle session (" + username + "): " + moodleSession);
      future["return"]({ session: moodleSession });
    }
  });
  moodleSession = future.wait();
  if (moodleSession.error)
    throw moodleSession.error;
  return moodleSession.session;
};

LessonController._fetchMoodleSession = function() {
  return this.moodleLogin(Meteor.settings.moodleUsername, Meteor.settings.moodlePassword);
};

LessonController._getMoodleSession = function(fetch) {
  var self = this;
  if (!fetch && self._moodleSession)
    return self._moodleSession;
  else
    return self._moodleSession = self._fetchMoodleSession();
};

LessonController._getLessonsHtml = function(lessonsUrl, moodleSession) {
  var future = new Future();
  request({
    url: lessonsUrl,
    encoding: null, // return a byte stream instead of a string
    headers: {
      "Cookie": "MoodleSession=" + moodleSession
    },
    followRedirect: false
  }, function(err, res, buffer) {
    if (err || res.statusCode === 303)
      future["return"](null);
    else {
      // make the latin1 buffer a utf8 buffer and then a string
      var html = encoding.convert(buffer, "utf-8", "iso-8859-1").toString();
      future["return"](html);
    }
  });
  return future.wait();
};

LessonController._processLessonsHtml = function(lessonsType, lessonsHtml) {
  var self = this;
  var $ = cheerio.load(lessonsHtml);
  var date = $(".svp-plandatum-heute, .svp-plandatum-morgen").text().trim();
  date = new Date(date.replace(/^(.*)(\d{2})\.(\d{2})\.(\d{4})$/, "$4-$3-$2"));
  var updated = $(".svp-uploaddatum").text().trim();
  updated = new Date(updated.replace(/^(.*)(\d{2})\.(\d{2})\.(\d{4})(.*)(\d{2}):(\d{2})(.*)$/, "$4-$3-$2 $6:$7 +0200"));
  var lastUpdated = LessonsUpdated.getProperty(lessonsType, "updated");
  if (lastUpdated && lastUpdated.getTime() === updated.getTime()) {
    console.log("No refresh needed. (Last updated: " + updated.toDateString() +
      " " + updated.getHours() + ":" + updated.getMinutes() + ")");
  } else {
    LessonsUpdated.set(lessonsType, date, updated);
    Lessons.remove({ type: lessonsType });
    return self._processLessons(lessonsType, $);
  }
};

LessonController._processLessons = function(lessonsType, $) {
  var lessons = $("tr.svp-gerade, tr.svp-ungerade");

  var findPropertyUnbound = function(property) {
    var element = $(this).find(".svp-" + property + "-gerade, .svp-" + property + "-ungerade");
    var value = element.text().trim();
    return value ? value : null;
  };

  var lastPeriod, savedLessons = [];
  lessons.each(function(idx, lesson) {
    var findProperty = findPropertyUnbound.bind(lesson);
    var period = parseInt(findProperty("stunde"));
    savedLessons.push({
      type: lessonsType,
      period: period ? lastPeriod = period : lastPeriod,
      absent: findProperty("esfehlt"),
      substitute: findProperty("esvertritt"),
      class: findProperty("klasse").replace(/[a-zA-Z]?\.\.\/Bd/, ""),
      subject: findProperty("fach"),
      notice: findProperty("bemerkung"),
      room: findProperty("raum")
    });
  });
  return savedLessons;
};

LessonController.refreshLessons = function(lessonsType, lessonsUrl) {
  var self = this;
  console.log("Refreshing " + lessonsType + "'s lessons ...");

  var moodleSession = self._getMoodleSession();
  var lessonsHtml = self._getLessonsHtml(lessonsUrl, moodleSession);
  if (!lessonsHtml) {
    console.log("Moodle session expired.");
    moodleSession = self._getMoodleSession(true);
    lessonsHtml = self._getLessonsHtml(lessonsUrl, moodleSession);
    if (!lessonsHtml)
      throw new Error("Could not acquire Moodle session.");
  }
  var lessons = self._processLessonsHtml(lessonsType, lessonsHtml);
  _.each(lessons, function(lesson) {
    Lessons.insert(lesson);
    console.log("#" + lesson.period + " " +
      lesson.absent + (lesson.substitute ? "\t-> " + lesson.substitute : ""));
  });
};

LessonController.refreshAllLessons = function() {
  LessonController.refreshLessons("today", Meteor.settings.lessonsTodayUrl);
  LessonController.refreshLessons("tomorrow", Meteor.settings.lessonsTomorrowUrl);
};