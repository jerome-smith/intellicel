//
// express web application framework for node
//
var chromelogger = require('chromelogger'),
    express     = require('express'),
    _           = require('underscore'),
    fs          = require('fs'),
    staticDir   = express['static'],
    path        = require('path');

var startServer = function(port) {
  'use strict';

  var index, app, opts = _.extend({
      port    : port,
      tests   : true,
      baseDir : './'
  }, opts || {});

  app = express();
  app.use(chromelogger.middleware);

  app.configure(function() {
    console.log('serving static files from...');
    global.config.staticDirs.forEach(function(dir) {
      console.log(opts.baseDir + dir);
      app.use('/' + dir, staticDir(opts.baseDir + dir));
    });
    app.use(express.bodyParser());
  });

  // running the selenium tests using the selenium standalone server we use port
  // 8002, which uses a differnt index page and a compressed js file
  if (opts.port === global.config.fixSvr3) { // port 8002
    index = global.config.seleniumIndex;
  } else {
    index = global.config.appIndex;
  }
  console.log(('using ' + index).green, ('serving static content on port '+opts.port).green);
  // this pipes the app/index.html to the response
  app.get("/", function(req, res) {
    fs.createReadStream(opts.baseDir + index).pipe(res);
  });

  app.get("/splash/index.html", function(req, res) {
    var file = fs.createReadStream(opts.baseDir + 'app/splash/index.html'),
        token = req.query.token;
    console.log('Access token ::: ' + token);
    file.on('data', function (chunk) {
      var data = chunk.toString().replace(/\$\{absoluteUrl\}/g, '/splash')
                                  .replace(/\${authParam\}/g, '?ApiKey=apikey1&accessToken=' + token);
      res.write(data);
    });
    file.on('end', function () {
      res.end();
      return;
    });
  });

  // app.get("/splash/*", function(req, res) {
  //   var url = opts.baseDir + 'app' + req.url.split('?')[0].replace(/%20/g, ' ');
  //   console.log('Splash file ::: ' + url + ':::');
  //   fs.createReadStream(url).pipe(res)
  //     .on('error', function (err) {
  //       console.log('File err ::: ' + err);
  //     });
  // });

  app.get("/css/*", function(req, res) {
    console.log('forwarding css request to ' + opts.baseDir + 'assets' + req.url);
    fs.createReadStream(opts.baseDir + 'assets' + req.url).pipe(res);
  });



  if (opts.tests) {
    app.get("/_test", function(req, res) {
      fs.createReadStream(opts.baseDir + global.config.testIndex).pipe(res);
    });
  }

  // Actually listen
  console.log(('Express server listening on ' + opts.port).red);
  app.listen(opts.port || null);

  return app;
};

module.exports = {
  start : startServer
};
