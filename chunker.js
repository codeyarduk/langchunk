const esprima = require("esprima");
const estraverse = require("estraverse");

const code = `function addMetadata(chunks) {
  return chunks.map((chunk, index) => ({
    id: index,
    content: chunk,
    type: determineType(chunk), // You need to implement this function
    position: index,
    length: chunk.length
  }));
}

const chunksWithMetadata = addMetadata(finalChunks);
console.log(chunksWithMetadata);
`;

const ast = esprima.parseScript(code, { loc: true });
fileName = "chunker.js";

function extractCodeChunks(ast, sourceCode, fileName) {
  const chunks = [];
  estraverse.traverse(ast, {
    enter: function (node, parent) {
      if (
        node.type === "FunctionDeclaration" ||
        node.type === "ClassDeclaration" ||
        node.type === "VariableDeclaration" ||
        node.type === "ExpressionStatement"
      ) {
        const start = node.loc.start.line - 1;
        const end = node.loc.end.line;
        const chunkText = sourceCode.split("\n").slice(start, end).join("\n");
        const chunk = {
          text: chunkText,
          fileName: fileName,
          startLine: start + 1,
          endLine: end,
        };

        chunks.push(chunk);
      }
    },
  });
  return chunks;
}
const codeChunks = extractCodeChunks(ast, code);
// console.log(codeChunks);

const MAX_CHUNK_SIZE = 1000;

function adjustChunkSize(chunks) {
  const adjustedChunks = [];
  chunks.forEach((chunk) => {
    if (chunk.length > MAX_CHUNK_SIZE) {
      const subChunks = chunk.match(new RegExp(`.{1,${MAX_CHUNK_SIZE}}`, "g"));
      adjustedChunks.push(...subChunks);
    } else {
      adjustedChunks.push(chunk);
    }
  });
  return adjustedChunks;
}

const finalChunks = adjustChunkSize(codeChunks);
console.log(finalChunks);

function determineType(chunk) {
  // Implement this based on your needs
  return "Function";
}

function addMetadata(chunks) {
  return chunks.map((chunk, index) => ({
    id: index,
    content: chunk,
    type: determineType(chunk),
    position: index,
    length: chunk.length,
  }));
}

const chunksWithMetadata = addMetadata(finalChunks);

// const vectorDatabase = require("vector-database-client");

// chunksWithMetadata.forEach((chunk) => {
//   vectorDatabase.insert(chunk);
// });
