'use strict';

var mongoose = require('mongoose'),
    ViewData = mongoose.model('ViewData'),
    path = require('path'),
    fs = require('fs'),
    saveService = require('../helpers/saveFile'),
    decoder = require('../helpers/decoders');

/**
 * Get viewdatas
 */
exports.getAll = function(req, res) {
  return ViewData.find({}).exec(function (err, viewdatas) {
    if (!err) {
      return res.json(viewdatas);
    } else {
      return res.send(err);
    }
  });
};

/**
 * Get header
 */
exports.getHeader = function(req, res) {
  return ViewData.findOne({ 'data.key': 'Header' }).exec(function (err, header) {
    if (!err) {
      return res.json(header);
    } else {
      return res.send(err);
    }
  });
};

/**
 * Get homemain
 */
exports.getHomeMain = function(req, res) {
  return ViewData.findOne({ 'data.key': 'Home Main' }).exec(function (err, header) {
    if (!err) {
      return res.json(header);
    } else {
      return res.send(err);
    }
  });
};

/**
 * Get miscdata
 */
exports.getMiscData = function(req, res) {
  return ViewData.findOne({ 'data.key': 'Miscellaneous View Text' }).exec(function (err, header) {
    if (!err) {
      return res.json(header);
    } else {
      return res.send(err);
    }
  });
};

/**
 * Get corporateinfo
 */
exports.getCorporateInfo = function(req, res) {
  return ViewData.findOne({ 'data.key': 'Corporate Info' }).exec(function (err, header) {
    if (!err) {
      return res.json(header);
    } else {
      return res.send(err);
    }
  });
};

/**
 * Get customerservices
 */
exports.getCustomerServices = function(req, res) {
  return ViewData.findOne({ 'data.key': 'Customer Services' }).exec(function (err, header) {
    if (!err) {
      return res.json(header);
    } else {
      return res.send(err);
    }
  });
};

/**
 * Get popularproducts
 */
exports.getPopularProducts = function(req, res) {
  return ViewData.findOne({ 'data.key': 'Popular Products' }).exec(function (err, header) {
    if (!err) {
      return res.json(header);
    } else {
      return res.send(err);
    }
  });
};

/**
 * Delete viewdata
 */
exports.remove = function (req, res, next) {
  var viewdataId = req.params.id;
  // delete the viewdata
  ViewData.findById(viewdataId, function (err, viewdata) {
    if (viewdata) {
      viewdata.remove();
    } else {
      return res.send(404);
    }
  });
  // return the new list of viewdatas
  // this step seems to be required in order update the viewdatas list
  return ViewData.find(function (err, viewdatas) {
    if (!err) {
      return res.json(viewdatas);
    } else {
      return res.send(err);
    }
  });
};

/**
 * Get one viewdata
 */
exports.getOne = function (req, res, next) {
  var viewdataId = req.params.id;
 // get the viewdata
  ViewData.findById(viewdataId, function (err, viewdata) {
    if (viewdata) {
      res.send(viewdata);
    } else {
      return res.send(404);
    }
  });
};

/**
 * Update viewdata
 */
exports.update = function (req, res, next) {
  // extract the id of the viewdata
  var viewdataId = req.body.id;
  // extract the key of the viewdata
  var viewdataKey = req.body.key;
  // extract the value of the viewdata
  var viewdataValue = req.body.value;
  ViewData.findById(viewdataId, function (err, viewdata) {
    // update the viewdata with the received data
    viewdata.update(
      {
        $set: {
          viewdataKey : viewdataValue
        }
      },
      { upsert: true },
      function(err) {
        if (!err) {
          return ViewData.find(function (err, viewdatas) {
            if (!err) {
              return res.json(viewdatas);
            } else {
              return res.send(err);
            }
          });
        } else {
          return res.send(err);
        }
      }
    );
  });
};

/**
 * Create viewdata
 */
// exports.create = function (req, res, next) {
//   // try to create a new record with the data sent from restangular
//   var data = req.body[0].binaryString;

//   var fileBuffer = decoder.decodeBase64File(data);

//   saveService.saveFile(fileBuffer, "./app/images/viewdatas/", req.body[1].viewdata_id);

//   var createdViewData = new ViewData(req.body[1]);
//   createdViewData.save(function(err) {
//     // if there was no problem creating the new record,
//     // return it as a json object
//     if (!err) {
//       return ViewData.find(function (err, viewdatas) {
//         if (!err) {
//           return res.json(viewdatas);
//         } else {
//           return res.send(err);
//         }
//       });
//     } else {
//       return res.send(err);
//     }
//   });
// };
