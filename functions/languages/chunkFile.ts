import Parser from "tree-sitter";
import JavaScript from "tree-sitter-javascript";
import readFile from "../readFiles/readFile";

// Type declarations
interface chunkFileParams {
  path: string;
  code?: string;
  languageNodes?: string;
}

interface findChunksParams {
  node: any;
  code: string;
  path: string;
  languageNodes?: string;
}

const chunkFile = async ({ path, languageNodes }: chunkFileParams) => {
  const code = await readFile({ path: path });
  const parser = new Parser();
  parser.setLanguage(JavaScript);
  const tree = parser.parse(code as any);
  if (!tree) {
    console.log("Failed to parse the code");
  }
  // console.log("hi");
  return findChunks({
    node: tree,
    code: (tree as any).input,
    path,
    languageNodes,
  });
};

const findChunks = ({ node, code, path, languageNodes }: findChunksParams) => {
  // Recursive function to log node details and its children
  const MAX_CHUNK_SIZE: number = 1000;
  let goDeeper: boolean = false;
  let chunkArray: any = [];
  let checkDuplicates: string[] = [];
  let tempChunks: string = "";
  let tempChunkLength: number = 0;

  const logNodeDetails = (node: any, depth: number = 0) => {
    const listAllowedNodeTypes = languageNodes || [""];
    // console.log(node.type);
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
        if (!checkDuplicates.includes(chunkCode)) {
          checkDuplicates.push(chunkCode);
          // console.log(chunkCode);

          if (tempChunkLength > 500) {
            chunkArray.push({
              data: tempChunks,
              file_name: path,
            });
            tempChunks = "";
            tempChunkLength = 0;
          } else {
            tempChunkLength += chunkCode.length;
            tempChunks = `${tempChunks}\n${chunkCode}`;
          }
        }
      }
    }
    // Iterate through each child of the node
    for (let i = 0; i < node.childCount; i++) {
      const child = node.child(i);
      logNodeDetails(child, depth + 1);
    }

    // NEEDS TO BE CHECK HERE TO MAKE SURE THAT DUPLICATED CONTENT ISN'T BEING PUSHED TO chunkArray

    if (tempChunks.length > 0) {
      chunkArray.push({
        data: tempChunks,
        file_name: path,
      });

      console.log(tempChunks);

      tempChunks = "";
      tempChunkLength = 0;
    }

    const chunkDirObject = {
      file_path: path,
      data_chunks: chunkArray,
    };

    // tempChunks = "";
    // console.log(chunkArray);
    // chunkArray = [];

    return chunkDirObject;
  };

  tempChunks = "";
  tempChunkLength = 0;

  // Start logging from the root node
  return logNodeDetails(node.rootNode);
  // return node.rootNode;
};

export default chunkFile;
