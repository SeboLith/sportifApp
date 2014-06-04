'use strict';

var mongoose = require('mongoose'),
    Thing = mongoose.model('Thing');

/**
 * Get awesome things
 */
exports.getAll = function(req, res) {
  return Thing.find(function (err, things) {
    if (!err) {
      return res.json(things);
    } else {
      return res.send(err);
    }
  });
};

/**
 * Create thing
 */
exports.create = function (req, res, next) {
  var newThing = new Thing(req.body);
  newThing.provider = 'local';
  newThing.save(function(err) {
    if (err) return res.json(400, err);
  });
};
