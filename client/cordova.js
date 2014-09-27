Meteor.startup(function() {
  if (Meteor.isCordova) {
    document.addEventListener("deviceready", function() {
      navigator.splashscreen.hide();

      document.addEventListener("backbutton", function() {
        if (Router.current().route.name === "today")
          navigator.app.exitApp();
        else
          navigator.app.backHistory();
      }, false);

      Cordova.writeFile = function(directoryPath, fileName, content, cb) {
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

      Cordova.readFile = function (directoryPath, fileName, cb) {
        var fail = function (err) {
          cb(new Error("Failed to read file: ", err), null);
        };
        window.resolveLocalFileSystemURL(directoryPath,
          function (dirEntry) {
            var success = function (fileEntry) {
              fileEntry.file(function (file) {
                var reader = new FileReader();
                reader.onloadend = function (evt) {
                  cb(null, evt.target.result);
                };
                reader.readAsText(file);
              }, fail);
            };
            dirEntry.getFile(fileName, { create: true, exclusive: false }, success, fail);
          }, fail);
      };
    }, false);
  }
});