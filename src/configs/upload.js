"use strict";
exports.__esModule = true;
exports.MULTER = exports.UPLOADS_FOLDER = exports.TMP_FOLDER = void 0;
// Core dependencies
var path = require("path");
var multer = require("multer");
var crypto = require("crypto");
exports.TMP_FOLDER = path.resolve(__dirname, '..', '..', 'tmp');
exports.UPLOADS_FOLDER = path.resolve(exports.TMP_FOLDER, 'uploads');
exports.MULTER = {
    storage: multer.diskStorage({
        destination: exports.TMP_FOLDER,
        filename: function (request, file, callback) {
            var fileHash = crypto.randomBytes(10).toString('hex');
            var fileName = "".concat(fileHash, "-").concat(file.originalname);
            return callback(null, fileName);
        }
    })
};
