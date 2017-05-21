var tools = require('../tools');

module.exports =  function () {
  "use strict";

  var id = tools.random();

  return {
    "id": id,
    "name": "fake-real-Domain-"+id+".com"
  };

};




