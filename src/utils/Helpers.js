"use strict";
exports.__esModule = true;
var Helpers = /** @class */ (function () {
    function Helpers() {
    }
    Helpers.prototype.checkArrayOfStrings = function (arr) {
        /* Helper function to check if all items from array are of type 'string' */
        for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
            var item = arr_1[_i];
            if (typeof item !== 'string') {
                return false;
            }
        }
        return true;
    };
    return Helpers;
}());
exports["default"] = Helpers;
