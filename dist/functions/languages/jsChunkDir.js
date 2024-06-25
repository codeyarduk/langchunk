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
const tree_sitter_1 = __importDefault(require("tree-sitter"));
const tree_sitter_javascript_1 = __importDefault(require("tree-sitter-javascript"));
const readFile_1 = __importDefault(require("../readFiles/readFile"));
const jsChunkDir = (_a) => __awaiter(void 0, [_a], void 0, function* ({ path }) {
    const code = yield (0, readFile_1.default)({ path: path });
    const parser = new tree_sitter_1.default();
    parser.setLanguage(tree_sitter_javascript_1.default);
    const tree = parser.parse(code);
    if (!tree) {
        console.log("Failed to parse the code");
    }
    // console.log("hi");
    return findChunks({ node: tree, code: tree.input, path });
});
const findChunks = ({ node, code, path }) => {
    // Recursive function to log node details and its children
    const MAX_CHUNK_SIZE = 1000;
    let goDeeper = false;
    let chunkArray = [];
    const logNodeDetails = (node, depth = 0) => {
        const listAllowedNodeTypes = [
            "import_statement",
            "lexical_declaration",
            "class_declaration",
            "function_declaration",
            "arrow_function",
        ];
        // console.log(node.type, node.startPosition, node.endPosition);
        if (listAllowedNodeTypes.includes(node.type)) {
            const startPosition = node.startPosition;
            const endPosition = node.endPosition;
            const chunk = code
                .split("\n")
                .slice(startPosition.row, endPosition.row + 1);
            const chunkCode = chunk.join("\n");
            if (chunkCode.length > MAX_CHUNK_SIZE) {
                for (let i = 0; i < node.childCount; i++) {
                    const child = node.child(i);
                    logNodeDetails(child, depth + 1);
                }
            }
            else {
                chunkArray.push({
                    data: chunkCode,
                    position: { start: startPosition, end: endPosition },
                    file_name: path,
                });
            }
        }
        // Iterate through each child of the node
        for (let i = 0; i < node.childCount; i++) {
            const child = node.child(i);
            logNodeDetails(child, depth + 1);
        }
        const chunkDirObject = {
            file_path: path,
            data_chunks: chunkArray,
        };
        return chunkDirObject;
    };
    // Start logging from the root node
    return logNodeDetails(node.rootNode);
    // return node.rootNode;
};
exports.default = jsChunkDir;
