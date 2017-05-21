var http        = require("http"),
    url         = require("url"),
    util        = require('util'),
    colors      = require('colors'),
    fs          = require('fs'),
    _           = require('underscore'),


module.exports = function (DB, app, tools) {
  'use strict';

  var getSignedInUser = function () {
    var user = DB.getDatabase('admin');

    if (!user.signedInUser || !user.signedInUser.accountId) {
      user.signedInUser = DB.getJson('signedInUser');
    }

    return user.signedInUser;
  },
  signIn = function (req, res) {
    //Check flag, if flag then reurn
    var u = getSignedInUser();

    DB.getDatabase('admin').originalUser = JSON.parse(JSON.stringify(u));

    if (req.body.username === 'nonadmin') {
      _.extend(u, {
        firstName : 'Non',
        lastName  : 'Admin-User',
        email     : '',
        id        : ,
        personId  : ,
        accountId :
      });
    }
    else {
      u = DB.getDatabase('admin').originalUser;
    }
    DB.getDatabase('admin').signedInUser =u;
    delete u.password;
    tools.respondJson(req, res, u);
  },

  getSsoDetails = function (req, res) {
    var resp = {
      federationUrl : '',
      linkText : '',
      isSSOSite : true
    };

    tools.report(req.method, req.url, "GET SSO Status");
    tools.respondJson(req, res, resp);
  },

  updateSecuritySettings = function (req, res) {
    res.status(204);
    tools.respondJson(req, res, {});
  },

  passwordReset = function (req, res) {
    tools.respondJson(req, res, {});
  },

  logout = function (req, res){
    tools.respondJson(req, res, {});
  };

  app.post("/cmd/security/signin", signIn);
  app.post("/cmd/security/notifications", function (req, res) {
    tools.respondJson(req, res, req.body);
  });
  app.get("/cmd/security/sso-federation-details", getSsoDetails);
  app.put("/cmd/security/settings", updateSecuritySettings);
  app.post("/cmd/security/settings/password-reset", passwordReset);
  app.post("/cmd/security/logout", logout);
};