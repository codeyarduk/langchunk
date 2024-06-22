import Parser from "tree-sitter";
import JavaScript from "tree-sitter-javascript";

// Type declarations
interface jsChunkDirParams {
  path?: string;
  code: string;
}

interface findChunksParams {
  // node: Parser.Tree;
  node: any;
  code: string;
}

const jsChunkDir = ({ path, code }: jsChunkDirParams) => {
  // const language = "js";
  const parser = new Parser();
  parser.setLanguage(JavaScript);
  const tree = parser.parse(code);
  // console.log((tree as any).input);
  if (!tree) {
    console.log("Failed to parse the code");
  }

  return findChunks({ node: tree, code: (tree as any).input });
};

const findChunks = ({ node, code }: findChunksParams) => {
  // Recursive function to log node details and its children
  // console.log(code);
  const logNodeDetails = (node: any, depth: number = 0) => {
    // Log the current node's details
    if (node.type === "import_statement") {
      console.log("We got em!");
      console.log(
        "START OF IMPORT STATEMENT: ",
        node.startPosition,
        "END OF IMPORT STATEMENT: ",
        node.endPosition
      );

      const startPosition = node.startPosition;
      const endPosition = node.endPosition;
      const importStatement = code.substring(
        startPosition.column,
        endPosition.column + 2
      );
      console.log("Import Statement:", importStatement);
    }

    // Iterate through each child of the node
    for (let i = 0; i < node.childCount; i++) {
      const child = node.child(i);
      logNodeDetails(child, depth + 1); // Recursively log details for each child
    }
  };

  // Start logging from the root node
  logNodeDetails(node.rootNode);
  // return node.rootNode;
};

const getChunks = () => {};

jsChunkDir({
  code: ` 
          import y from "hello";
  console.log("it's a good day!");

  const myFunc = () => {
    return "Hello world!";
  }
  
  `,
});

export default jsChunkDir;
