const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const Parser = require("tree-sitter");
const Python = require("tree-sitter-python");
const JavaScript = require("tree-sitter-javascript");
const CSS = require("tree-sitter-css");
const logging = require("winston");

class CodeParser {
  static CACHE_DIR = path.join(require("os").homedir(), ".code_parser_cache");

  constructor(fileExtensions = null) {
    if (typeof fileExtensions === "string") {
      fileExtensions = [fileExtensions];
    }

    this.languageExtensionMap = {
      py: Python,
      js: JavaScript,
      jsx: JavaScript,
      css: CSS,
    };

    this.languageNames = fileExtensions
      ? fileExtensions.map((ext) => this.languageExtensionMap[ext])
      : [];
    this.languages = {};
    this._installParsers();
  }

  _installParsers() {
    logging.configure({
      transports: [
        new logging.transports.Console({
          format: logging.format.combine(
            logging.format.timestamp(),
            logging.format.printf(
              (info) => `${info.timestamp} - ${info.level}: ${info.message}`
            )
          ),
        }),
      ],
    });

    if (!fs.existsSync(CodeParser.CACHE_DIR)) {
      fs.mkdirSync(CodeParser.CACHE_DIR);
    }

    for (const [ext, lang] of Object.entries(this.languageExtensionMap)) {
      const repoPath = path.join(CodeParser.CACHE_DIR, `tree-sitter-${ext}`);

      if (!fs.existsSync(repoPath)) {
        const cloneCommand = `git clone https://github.com/tree-sitter/tree-sitter-${ext} ${repoPath}`;
        try {
          execSync(cloneCommand, { stdio: "pipe" });
        } catch (error) {
          logging.error(
            `Failed to clone repository for ${ext}. Command: '${cloneCommand}'. Error: ${error.message}`
          );
          throw new Error(`Failed to clone repository for ${ext}`);
        }
      }

      this.languages[ext] = lang;
    }
  }

  parseCode(code, fileExtension) {
    const language = this.languages[fileExtension];
    if (!language) {
      console.log(`Unsupported file type: ${fileExtension}`);
      return null;
    }

    const parser = new Parser();
    parser.setLanguage(language);
    const tree = parser.parse(code);

    if (!tree) {
      console.log("Failed to parse the code");
      return null;
    }

    return tree.rootNode;
  }

  extractPointsOfInterest(node, fileExtension) {
    const nodeTypesOfInterest = this._getNodeTypesOfInterest(fileExtension);

    const pointsOfInterest = [];
    if (nodeTypesOfInterest[node.type]) {
      pointsOfInterest.push({ node, type: nodeTypesOfInterest[node.type] });
    }

    for (const child of node.children) {
      pointsOfInterest.push(
        ...this.extractPointsOfInterest(child, fileExtension)
      );
    }

    return pointsOfInterest;
  }

  _getNodeTypesOfInterest(fileExtension) {
    const nodeTypes = {
      py: {
        import_statement: "Import",
        export_statement: "Export",
        class_definition: "Class",
        function_definition: "Function",
      },
      css: {
        tag_name: "Tag",
        "@media": "Media Query",
      },
      js: {
        import_statement: "Import",
        export_statement: "Export",
        class_declaration: "Class",
        function_declaration: "Function",
        arrow_function: "Arrow Function",
        statement_block: "Block",
      },
    };

    if (nodeTypes[fileExtension]) {
      return nodeTypes[fileExtension];
    } else if (fileExtension === "jsx") {
      return nodeTypes["js"];
    } else {
      throw new Error("Unsupported file type");
    }
  }

  extractComments(node, fileExtension) {
    const nodeTypesOfInterest = this._getNodesForComments(fileExtension);

    const comments = [];
    if (nodeTypesOfInterest[node.type]) {
      comments.push({ node, type: nodeTypesOfInterest[node.type] });
    }

    for (const child of node.children) {
      comments.push(...this.extractComments(child, fileExtension));
    }

    return comments;
  }

  _getNodesForComments(fileExtension) {
    const nodeTypes = {
      py: {
        comment: "Comment",
        decorator: "Decorator",
      },
      css: {
        comment: "Comment",
      },
      js: {
        comment: "Comment",
        decorator: "Decorator",
      },
    };

    if (nodeTypes[fileExtension]) {
      return nodeTypes[fileExtension];
    } else if (fileExtension === "jsx") {
      return nodeTypes["js"];
    } else {
      throw new Error("Unsupported file type");
    }
  }

  getLinesForPointsOfInterest(code, fileExtension) {
    const language = this.languages[fileExtension];
    if (!language) {
      throw new Error("Unsupported file type");
    }

    const parser = new Parser();
    parser.setLanguage(language);
    const tree = parser.parse(code);
    const rootNode = tree.rootNode;
    const pointsOfInterest = this.extractPointsOfInterest(
      rootNode,
      fileExtension
    );

    const lineNumbersWithTypeOfInterest = {};

    for (const { node, type } of pointsOfInterest) {
      const startLine = node.startPosition.row + 1;
      if (!lineNumbersWithTypeOfInterest[type]) {
        lineNumbersWithTypeOfInterest[type] = [];
      }
      if (!lineNumbersWithTypeOfInterest[type].includes(startLine)) {
        lineNumbersWithTypeOfInterest[type].push(startLine);
      }
    }

    return Object.values(lineNumbersWithTypeOfInterest).flat();
  }

  getLinesForComments(code, fileExtension) {
    const language = this.languages[fileExtension];
    if (!language) {
      throw new Error("Unsupported file type");
    }

    const parser = new Parser();
    parser.setLanguage(language);
    const tree = parser.parse(code);
    const rootNode = tree.rootNode;
    const comments = this.extractComments(rootNode, fileExtension);

    const lineNumbersWithComments = {};

    for (const { node, type } of comments) {
      const startLine = node.startPosition.row + 1;
      if (!lineNumbersWithComments[type]) {
        lineNumbersWithComments[type] = [];
      }
      if (!lineNumbersWithComments[type].includes(startLine)) {
        lineNumbersWithComments[type].push(startLine);
      }
    }

    return Object.values(lineNumbersWithComments).flat();
  }

  printAllLineTypes(code, fileExtension) {
    const language = this.languages[fileExtension];
    if (!language) {
      console.log(`Unsupported file type: ${fileExtension}`);
      return;
    }

    const parser = new Parser();
    parser.setLanguage(language);
    const tree = parser.parse(code);
    const rootNode = tree.rootNode;
    const lineToNodeType = this.mapLineToNodeType(rootNode);

    const codeLines = code.split("\n");

    for (const [lineNum, nodeTypes] of Object.entries(lineToNodeType)) {
      const lineContent = codeLines[lineNum - 1];
      console.log(
        `line ${lineNum}: ${nodeTypes.join(", ")} | Code: ${lineContent}`
      );
    }
  }

  mapLineToNodeType(node, lineToNodeType = {}) {
    const startLine = node.startPosition.row + 1;

    if (!lineToNodeType[startLine]) {
      lineToNodeType[startLine] = [];
    }
    lineToNodeType[startLine].push(node.type);

    for (const child of node.children) {
      this.mapLineToNodeType(child, lineToNodeType);
    }

    return lineToNodeType;
  }

  printSimpleLineNumbersWithCode(code) {
    const codeLines = code.split("\n");

    codeLines.forEach((line, index) => {
      console.log(`Line ${index + 1}: ${line}`);
    });
  }
}

module.exports = CodeParser;
