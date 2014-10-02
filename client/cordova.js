Meteor.startup(function() {
  if (Meteor.isCordova) {
    document.addEventListener("deviceready", function() {
      var overrideBackButton = function() {
        if (Router.current().route.name === "today")
          navigator.app.exitApp();
        else
          navigator.app.backHistory();
      };

      var overrideLinks = function(e) {
        var url = $(this).attr("href");
        navigator.app.loadUrl(url, { openExternal: true });
        e.preventDefault();
      };

      var writeFile = function(directoryPath, fileName, content, cb) {
        var fail = function(err) {
          cb(new Error("Failed to write file: ", err), null);
        };
        window.resolveLocalFileSystemURL(directoryPath,
          function(dirEntry) {
            var success = function(fileEntry) {
              fileEntry.createWriter(function(writer) {
                writer.onwrite = function(evt) {
                  var result = evt.target.result;
                  cb(null, result);
                };
                writer.onerror = fail;
                writer.write(content);
              }, fail);
            };
            dirEntry.getFile(fileName, { create: true, exclusive: false }, success, fail);
          }, fail);
      };

      var readFile = function(directoryPath, fileName, cb) {
        var fail = function(err) {
          cb(new Error("Failed to read file: ", err), null);
        };
        window.resolveLocalFileSystemURL(directoryPath,
          function(dirEntry) {
            var success = function(fileEntry) {
              fileEntry.file(function(file) {
                var reader = new FileReader();
                reader.onloadend = function(evt) {
                  cb(null, evt.target.result);
                };
                reader.readAsText(file);
              }, fail);
            };
            dirEntry.getFile(fileName, { create: true, exclusive: false }, success, fail);
          }, fail);
      };

      var disableHotCodePush = function() {
        var autoupdateSubscriptions = _.filter(Meteor.connection._subscriptions, function(subscription) {
          return subscription.name === "meteor_autoupdate_clientVersions";
        });
        autoupdateSubscriptions[0].stop();
      };

      navigator.splashscreen.hide();
      document.addEventListener("backbutton", overrideBackButton, false);
      $(document).on("click", 'a[href^="http"]', overrideLinks);
      Cordova.writeFile = writeFile;
      Cordova.readFile = readFile;
      disableHotCodePush();
    }, false);
  }
});