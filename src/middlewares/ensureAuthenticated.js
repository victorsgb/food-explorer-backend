"use strict";
exports.__esModule = true;
// Core dependencies
var jsonwebtoken_1 = require("jsonwebtoken");
var AppError_1 = require("../utils/AppError");
var auth_1 = require("../configs/auth");
function ensureAuthenticated(request, response, next) {
    var authHeader = request.headers.authorization;
    if (!authHeader) {
        throw new AppError_1["default"]('JWT Token não encontrado!', 401);
    }
    var _a = authHeader.split(' '), token = _a[1];
    try {
        var user_id = (0, jsonwebtoken_1.verify)(token, auth_1["default"].jwt.secret).sub;
        request.user = {
            id: Number(user_id)
        };
        return next();
    }
    catch (_b) {
        throw new AppError_1["default"]('JWT Token inválido!', 401);
    }
}
exports["default"] = ensureAuthenticated;
