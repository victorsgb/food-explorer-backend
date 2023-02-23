"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Helpers {
    checkArrayOfStrings(arr) {
        /* Helper function to check if all items from array are of type 'string' */
        for (let item of arr) {
            if (typeof item !== 'string') {
                return false;
            }
        }
        return true;
    }
}
exports.default = Helpers;
