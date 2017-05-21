var fs      = require("fs"),
    colors  = require('colors'),
    _       = require('underscore'),
    json    = {},
    methods = {},


getJSON = function (JSON, path) {
  "use strict";
  var files = fs.readdirSync(path), file, name, stat, execArr;

  console.log("-- LOADING FIXTURED JSON METHODS -- ".blue);

  for (var x = 0, l = files.length; x < l; x++) {
    file = files[x];
    stat = fs.lstatSync(path + file);
    // ignore the system files
    if (file === '.DS_Store') {
      continue;
    }
    // loop through nested directories
    if (stat.isDirectory()) {
      getJSON(JSON, path + file + '/');
    }

    execArr = /\/json\/([\w-\/]+).js$/.exec(path + file);
    if (_.isArray(execArr) && execArr.length >= 2) {
      name = execArr[1];
      JSON[name.replace(/\//, '.')] = require(path + file);
      console.log(("getJson()." + name).blue);
    }
  }
};


// this is the database object where all the information for fixtures is stored.
// if you want to add default properties to the DB object then do so in the
// 'resetDatabase' method below.
var DB = {};

module.exports = {
  init : function (app) {
    "use strict";
    getJSON(json, __dirname + "/json/");
  },

  getDatabase : function(name) {
    "use strict";

    if (!DB.initialised) {
      module.exports.resetDatabase();
    }

    if (typeof DB[name] === 'undefined') {
      return DB;
    }
    return DB[name];
  },

  getJson : function(name, data) {
    "use strict";
    if (typeof json[name] === 'undefined') {
      throw new Error("No JSON with the name " + name);
    }
    return json[name](data);
  },

  getSymphonyDatabase : function (aTableName, aQuery, aNestedValue) {
    if (!_.isUndefined(aNestedValue)) {
      var ids = [], results = [];

      _.each(json[aTableName], function(document) {
        if (_.isObject(document)) {
          _.each(document, function(val) {
            if (_.isObject(val)) {
              _.each(val, function(v) {
                if (v === aNestedValue) {
                  ids.push(document.id);
                }
              });
            }
          });
        }
      });

      _.each(ids, function (id) {
        var result = _.clone(_.findWhere(json[aTableName], {id: id}));
        results.push(result);
      });

      return results;
    }
    else if (aQuery) {
      return _.clone(_.where(json[aTableName], aQuery));
    }
    return _.clone(json[aTableName]);
  },


  resetDatabase: function() {
    "use strict";
    (function f (oldObj, newObj) {
      for (var key in oldObj) {
        if (oldObj.hasOwnProperty(key)) {
          newObj[key] = oldObj[key];
          if (_.isArray(oldObj[key])) {
            newObj[key] = [];
          }
          if (_.isObject(oldObj[key]) && !_.isArray(oldObj[key])) {
            newObj[key] = {};
            f(oldObj[key], newObj[key]);
          }
        }
      }
    }(global.config.database, DB = {}));

    console.log( ("db nuked").red);
    console.log(DB);
  }
};
