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
        style: {
            type : String,
        },
        vendor: {
            type : String,
            required : true
        },
        upc: {
            type : String,
        },
        sku: {
            type : String,
        },
        image: {
            type : String,
            required : true
        },
        url: {
            type : String,
        },
        category: {
            type : String,
            required : true
        },
        sub_category: {
            type : String
        },
        for: {
            type : String,
        },
        sport: {
            type : String,
        },
        description: {
            type : String,
            required : true
        },
        short_description: {
            type : String,
        },
        suggestedPrice: {
            type : String,
            required : true
        },
        listPrice: {
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
            type : [String],
        }
    }
);

mongoose.model('Product', ProductSchema);
