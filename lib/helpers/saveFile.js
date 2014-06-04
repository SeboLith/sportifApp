'use strict';

var fs = require('fs');

/*
 * function to strip the url meta information from data string
 */
function saveFile (fileBuffer, destination, file_name) {
  switch (fileBuffer.type) {
    case 'image/jpeg':
      var newPath = destination+file_name+".jpg";
      fs.writeFile(newPath, fileBuffer.data, function (err) {
        if (err) return err;
      });
      break;
    /*
     * for demo only
     */
    // case 'application/pdf':
    //   var newPath = destination+file_name+".pdf";
    //   fs.writeFile(newPath, fileBuffer.data, function (err) {
    //     if (err) return err;
    //   });
    //   break;
    default:
      console.log("the file type is unrecognized.");
  };
}

module.exports = {
  saveFile : saveFile
}
