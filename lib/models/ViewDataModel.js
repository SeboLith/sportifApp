'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * ViewData Schema
 */
var ViewDataSchema = new Schema(
    {
        data: { key: String, value: Schema.Types.Mixed }
    }
);

mongoose.model('ViewData', ViewDataSchema);
