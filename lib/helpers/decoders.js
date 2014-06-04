'use strict';

/*
 * function to strip the url meta information from data string
 */
function decodeBase64File(dataString) {
  // searches dataString for a match against a regular expression
  var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
      response = {};
      /*
       * matches[0] = dataString
       * matches[1] = data type
       * matches[2] = data value
       */

  // if the array does not contain three items, an improper data string was passed in
  if (matches.length !== 3) {
    return new Error('Invalid input string');
  }

  response.type = matches[1];
  response.data = new Buffer(matches[2], 'base64');

  return response;
};

module.exports = {
  decodeBase64File : decodeBase64File
}
