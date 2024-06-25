#!/usr/bin/env ts-node
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
exports.jsChunkFile = exports.jsChunkDir = void 0;
const jsChunkDir_1 = __importDefault(require("./functions/languages/jsChunkDir"));
exports.jsChunkDir = jsChunkDir_1.default;
const jsChunkFile_1 = __importDefault(require("./functions/languages/jsChunkFile"));
exports.jsChunkFile = jsChunkFile_1.default;
const readDir_1 = __importDefault(require("./functions/readFiles/readDir"));
const process_1 = require("process");
(() => __awaiter(void 0, void 0, void 0, function* () {
    const path = process_1.argv[2]; // Get the directory path from the command-line arguments
    if (path) {
        const data = yield (0, readDir_1.default)(path);
        console.log(data);
    }
    else {
        console.log("Please provide a directory path.");
    }
}))();
