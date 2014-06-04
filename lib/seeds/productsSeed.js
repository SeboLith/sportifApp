'use strict';

var mongoose = require('mongoose'),
  Product = mongoose.model('Product');

/**
 * Populate database with sample application data
 */

// Clear old item names, then add a default names
Product.find({}).remove(function() {
  Product.create(
    {
        "product_id"        : 1,
        "manufacturer"      : "Nike",
        "name"              : "Jordan Retro 1 High OG - Men's",
        "color"             : "Wht/Royal",
        "vendor"            : "Rachels Sporting Supply",
        "upc"               : "55088707",
        "image"             : "55088707.png",
        "url"               : "http://www.footlocker.com/product/model:190074/sku:55088707/jordan-retro-1-high-og-mens/yellow/blue/?cm=searchjordanretroshoes",
        "category"          : "Shoes",
        "sub_category"      : "Sneakers",
        "for"               : "male",
        "sport"             : "Basketball",
        "description"       : "The Jordan Retro 1 offers you the old-school Jordan look you've always coveted and the world-class style you've come to expect. Leather upper with the legendary Air Jordan wings logo on the side. Air-Sole® unit in the heel and a solid rubber outsole for traction.",
        "short_description" : "Short description",
        "suggestedPrice"    : "59.99",
        "listPrice"         : "49.99",
        "salePrice"         : "39.99",
        "available"         : true,
        "on_sale"           : true,
        "stock"             : 50,
        'sizes'             : [ 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 12.5, 13, 13.5, 14, 15, 16, 17, 18 ]
    },
    function() {
      console.log('finished populating products');
    }
  );
});
