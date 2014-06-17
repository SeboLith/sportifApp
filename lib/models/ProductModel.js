'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Product Schema
 */
var ProductSchema = new Schema(
    {
        product_id: {
            type : Number,
            required : true
        },
        manufacturer: {
            type : String,
            required : true
        },
        name: {
            type : String,
            required : true
        },
        color: {
            type : String,
        },
        vendor: {
            type : String,
            required : true
        },
        upc: {
            type : String,
        },
        src: {
            type : String,
        },
        link: {
            type : String,
        },
        category: {
            type : String,
            required : true
        },
        sub_category: {
            type : String
        },
        user: {
            type : String,
        },
        activity: {
            type : String,
        },
        description: {
            type : String,
            required : true
        },
        short_description: {
            type : String,
        },
        availability: {
            type : String,
        },
        suggestedPrice: {
            type : String,
            required : true
        },
        currentPrice: {
            type : String,
            required : true
        },
        salePrice: {
            type : String,
            required : true
        },
        available: {
            type : Boolean,
            required : true
        },
        on_sale: {
            type : Boolean,
            required : true
        },
        stock: {
            type : Number,
            required : true
        },
        sizes: {
            type : [String]
        }
    }
);

mongoose.model('Product', ProductSchema);
