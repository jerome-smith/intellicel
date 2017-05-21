
var http        = require("http"),
  url         = require("url"),
  util        = require('util'),
  colors      = require('colors'),
  fs          = require('fs'),
  _           = require('underscore'),


module.exports = function (DB, app, tools) {
  'use strict';

  app.post("/cmd/secure-file-transfers", function (req, res) {
    tools.respondJson(req, res, req.body);
  });

  app.get("/cmd/secure-file-transfers-external/:sessionId/users/:userId/files/:fileId", function (req, res) {
    tools.respondNull(req, res);
  });


  app.get("/cmd/secure-file-transfers-external/:sessionId/users/:userId",
    function (req, res) {
    tools.respondJson(req, res,
      coreMethods.getSecureFiles(req.params , req.query));
  });
};
