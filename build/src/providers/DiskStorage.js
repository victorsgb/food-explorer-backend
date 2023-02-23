"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Core dependencies
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const upload_1 = require("../configs/upload");
class DiskStorage {
    saveFile(file) {
        return __awaiter(this, void 0, void 0, function* () {
            yield fs_1.default.promises.rename(path_1.default.resolve(upload_1.TMP_FOLDER, file), path_1.default.resolve(upload_1.UPLOADS_FOLDER, file));
            return;
        });
    }
    deleteFile(file) {
        return __awaiter(this, void 0, void 0, function* () {
            const filePath = path_1.default.resolve(upload_1.UPLOADS_FOLDER, file);
            try {
                yield fs_1.default.promises.stat(filePath);
            }
            catch (_a) {
                return;
            }
            yield fs_1.default.promises.unlink(filePath);
        });
    }
}
exports.default = DiskStorage;
