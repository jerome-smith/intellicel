    url    = require("url"),
    moment = require('moment'),
    _ = require('underscore');

module.exports = {
  respondHTML: function(req, res, html) {
    'use strict';

    if (req && res) {
      console.log("FIXTURE: ", req.url);

      if (req.query) {
        console.log("--- Params ------------------------------------------------".cyan);
        console.log(req.query);
        console.log("--- End Params --------------------------------------------".cyan);
      }
      res.send(html);
    }
    console.log(html);
  },

  respondJson : function (req, res, json) {
    'use strict';
    if (req && res) {
      console.log("RESPONSE MOCK: JSON: ".green, req.method + ": " + req.url);
      res.json(json);
      res.end();
    }
  },

  respond400 : function (req, res) {
    'use strict';
    console.log('Sending 400'.red);
    res.send(400, 'Bad request');
    res.end();
  },

  respond404 : function (req, res) {
    'use strict';
    console.log('Sending 404'.red);
    res.send(404, 'Not found');
    res.end();
  },

  respond500 : function (req, res, message) {
    'use strict';
    console.log('Sending 404'.red);
    var msg = message ? ' - ' + message : '';
    res.send(500, 'Internal server error' + msg);
  },

  respond200 : function (req, res) {
    'use strict';
    console.log('Sending 200 OK'.red);
    res.send(200, 'OK');
    res.end();
  },

  respond403 : function (req, res) {
    'use strict';
    console.log('Sending 403 Forbidden'.red);
    res.send(403, '{"error":{"status":"unauthorised","code":1000011,"error":"SIGNINFAILED","errorInfo":"Authorization information invalid."}}');
    res.end();
  },

  respond201 : function (req, res, json) {
    'use strict';
    console.log('Sending 201'.red);
    res.send(200, json);
    res.end();
  },

  respond204 : function (req, res) {
    'use strict';
    console.log('Sending 204 - No Content'.red);
    res.send(204, 'No Content');
  },

  respondNull : function (req, res, json ) {
    'use strict';
    console.log("RESPONSE MOCK: NULL: ".red, req.method + ": " + req.url);
    res.json(json);
    res.end();
  },

  report : function (meth, uri, desc) {
    'use strict';
    var seg = (url.parse(uri).pathname).split("/");
    console.log("------------------------------------------------------".red);
    console.log(meth + " : "+ desc +" : " + seg[3] || "");
    console.log("");

    return seg[3] || false;
  },

  random : function () {
    "use strict";
    return Math.floor(Math.random() * 99999) + 10000;
  },

  utcDate : function (date) {
    "use strict";
    return moment(date || new Date()).format('YYYY-MM-DDTHH:mm:ssZ');
  },

  // Returns the index of the object whose property matches that sought, or
  // undefined if there is no match.
  indexOfObject : function(aArrayOfObjects, aSearchItem, aModifier) {
    'use strict';

    var ret;

    _.each(aArrayOfObjects, function (aObject, aIndex) {
      if (aModifier) {
        if (aObject[_.keys(aSearchItem)[0]][aModifier] ===
          aSearchItem[_.keys(aSearchItem)[0]]) {
          ret = aIndex;
          return true;
        }
      }
      else {
        if (aObject[_.keys(aSearchItem)[0]] ===
          aSearchItem[_.keys(aSearchItem)[0]]) {
          ret = aIndex;
          return true;
        }
      }
    });
    return ret;
  },

  // Returns an array of indexes of objects containing the property match sought,
  // or undefined if there are no matches.
  indexesOfObjects : function(aArrayOfObjects, aSearchItem, aModifier) {
    'use strict';

    var ret = [];

    _.each(aArrayOfObjects, function (aObject, aIndex) {
      if (aModifier) {
        if (aObject[_.keys(aSearchItem)[0]][aModifier] ===
          aSearchItem[_.keys(aSearchItem)[0]]) {
          ret.push(aIndex);
          return true;
        }
      }
      else {
        if (aObject[_.keys(aSearchItem)[0]] ===
          aSearchItem[_.keys(aSearchItem)[0]]) {
          ret.push(aIndex);
          return true;
        }
      }
    });
    return ret.length ? ret : undefined;
  },

  // If the variable into which an element is to be pushed isn't an array, make
  // it into one then do the push (throw an error if the target variable is of
  // any type other than an array or undefined.
  forcePush : function (aTarget, aTargetElement, aElement) {
    'use strict';
    if (aTargetElement) {
      if (!_.isArray(aTarget[aTargetElement]) &&
        !_.isUndefined(aTarget[aTargetElement])) {
        throw new Error('Object is of incorrect type for method.');
      }
      else {
        aTarget[aTargetElement] = _.isArray(aTarget[aTargetElement]) ?
          aTarget[aTargetElement] : [];
        aTarget[aTargetElement].push(aElement);
      }
    }
    else {
      if (!_.isArray(aTarget) &&
        !_.isUndefined(aTarget)){
        throw new Error('Object is of incorrect type for method.');
      }
      else {
        aTarget = _.isArray(aTarget) ? aTarget : [];
        aTarget.push(aElement);
      }
    }
  },
  toUnderscoredCaps : function (aString) {
    'use strict';

    var arr = aString.split(''), newArr = [];

    _.each(arr, function (aLetter, aIndex) {
      if (/[A-Z]/.test(aLetter)) {
        newArr.push('_');
        newArr.push(aLetter);
      }
      else {
        newArr.push(aLetter.toUpperCase());
      }
    });
    return newArr.join('');
  },
  calculateDate : function (duration, date, workweek, variant){
    'use strict';
    var days = 1,
        hrs = variant * 24;
    workweek = workweek + ",";
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    while(days < duration)
    {
      date.setHours(hrs);
      if(workweek.indexOf((date.getDay() + 1) + ",") > -1) days++;
    }
    return date;
  },
  checkStartDate : function(date, workweek){
    'use strict';
    var isValid = false;
    workweek = workweek + ",";
    do
    {
      if(workweek.indexOf((date.getDay() + 1) + ",") === -1)
        date.setHours(24);
      else
        isValid = true;
    }while(!isValid)

    return date;
  },
  getDatewithFormat: function(date, format, locale, datetype){
    var self = _.extend({},{ dateType   : datetype || "startOf",
                             date       : date,
                             locale     : locale,
                             dateFormat : format,
                             formatted  : ""});
    self.date = moment(self.date).tz(self.locale)[self.dateType]("day").toDate();
    self.formatted  = moment(self.date)[self.dateType]("day").format(self.dateFormat) + 'Z';
    return self;
  }
};
