import Parser from "tree-sitter";
import JavaScript from "tree-sitter-javascript";
import readFile from "../readFiles/readFile";

// Type declarations
interface jsChunkDirParams {
  path: string;
  code?: string;
}

interface findChunksParams {
  // node: Parser.Tree;
  node: any;
  code: string;
  path: string;
}

const jsChunkDir = async ({ path }: jsChunkDirParams) => {
  const code = await readFile({ path: path });
  const parser = new Parser();
  parser.setLanguage(JavaScript);
  const tree = parser.parse(code as any);
  if (!tree) {
    console.log("Failed to parse the code");
  }
  // console.log("hi");
  return findChunks({ node: tree, code: (tree as any).input, path });
};

const findChunks = ({ node, code, path }: findChunksParams) => {
  // Recursive function to log node details and its children
  const MAX_CHUNK_SIZE: number = 1000;
  let goDeeper: boolean = false;
  let chunkArray = [];

  const logNodeDetails = (node: any, depth: number = 0) => {
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
      } else {
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

    return chunkArray;
  };

  // Start logging from the root node
  return logNodeDetails(node.rootNode);
  // return node.rootNode;
};

// console.log(
//   jsChunkDir({
//     code: `
//   import y from "hello";
//   console.log("it's a good day!");

//   const myFunc = () => {
//     return "Hello world!";
//     const myTwo = 'Hi two?';
//   }

//   class MyClass {
//     const myFunc2 = () => {
//       return "Hello world!";
//       const myTwo = 'Hi two?';
//     }

//     const myFunc3 = () => {
//       return "Hello world!";
//       const myTwo = 'Hi two?';
//     }
//   }

//   class MyClass2 {
//     myMethod() {
//       return "Hello world!";
//     }

//     import y from "hello";

//   }
//   `,
//   })
// );

export default jsChunkDir;
