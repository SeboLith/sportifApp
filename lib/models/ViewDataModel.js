'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * ViewData Schema
 */
var ViewDataSchema = new Schema(
    {
        data: { key: String, values: Schema.Types.Mixed }
    }
);

mongoose.model('ViewData', ViewDataSchema);
