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
const jsChunkDir_1 = __importDefault(require("../languages/jsChunkDir"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const processDirectory = (directoryPath) => __awaiter(void 0, void 0, void 0, function* () {
    const chunkedDir = [];
    const files = yield fs_1.default.promises.readdir(directoryPath);
    for (const file of files) {
        const filePath = path_1.default.join(directoryPath, file);
        const stats = yield fs_1.default.promises.stat(filePath);
        if (stats.isFile() && path_1.default.extname(filePath) === ".ts") {
            const data = yield (0, jsChunkDir_1.default)({ path: filePath });
            chunkedDir.push(data);
        }
    }
    const chunkDirObject = {
        dir_path: directoryPath,
        data_chunks: chunkedDir,
    };
    return chunkDirObject;
});
exports.default = processDirectory;
