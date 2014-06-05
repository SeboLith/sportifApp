'use strict';

var mongoose = require('mongoose'),
    Product = mongoose.model('Product'),
    path = require('path'),
    fs = require('fs'),
    saveService = require('../helpers/saveFile'),
    decoder = require('../helpers/decoders');

/**
 * Get products
 */
exports.getAll = function(req, res) {
  return Product.find({}).sort('product_id').exec(function (err, products) {
    if (!err) {
      return res.send(products);
    } else {
      return res.send(err);
    }
  });
};

/**
 * Delete product
 */
exports.remove = function (req, res, next) {
  var productId = req.params.id;
  // delete the product
  Product.findById(productId, function (err, product) {
    if (product) {
      product.remove();
    } else {
      return res.send(404);
    }
  });
  // return the new list of products
  // this step seems to be required in order update the products list
  return Product.find(function (err, products) {
    if (!err) {
      return res.json(products);
    } else {
      return res.send(err);
    }
  });
};

/**
 * Get one product
 */
exports.getOne = function (req, res, next) {
  var productId = req.params.id;
 // get the product
  Product.findById(productId, function (err, product) {
    if (product) {
      res.send(product);
    } else {
      return res.send(404);
    }
  });
};

/**
 * Update product
 */
exports.update = function (req, res, next) {
  // extract the id of the product
  var productId = req.body.id;
  // extract the name of the product
  var productName = req.body.name;
  // extract the email of the product
  var productEmail = req.body.email;
  // extract the profession of the product
  var productProfession = req.body.profession;
  // extract the about of the product
  var productAbout = req.body.about;
  // find the product
  Product.findById(productId, function (err, product) {
    // update the product with the received data
    product.update(
      {
        $set: {
          name : productName,
          email : productEmail,
          profession : productProfession,
          about : productAbout
        }
      },
      { upsert: true },
      function(err) {
        if (!err) {
          return Product.find(function (err, products) {
            if (!err) {
              return res.json(products);
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
 * Create product
 */
exports.create = function (req, res, next) {
  // try to create a new record with the data sent from restangular
  var data = req.body[0].binaryString;

  var fileBuffer = decoder.decodeBase64File(data);

  saveService.saveFile(fileBuffer, "./app/images/products/", req.body[1].product_id);

  var createdProduct = new Product(req.body[1]);
  createdProduct.save(function(err) {
    // if there was no problem creating the new record,
    // return it as a json object
    if (!err) {
      return Product.find(function (err, products) {
        if (!err) {
          return res.json(products);
        } else {
          return res.send(err);
        }
      });
    } else {
      return res.send(err);
    }
  });
};
