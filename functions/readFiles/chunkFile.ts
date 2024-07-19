import Parser from "tree-sitter";
import JavaScript from "tree-sitter-javascript";
import readFile from "./readFile";

// TYPE DECLARATIONS
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

  return findChunks({
    node: tree,
    code: (tree as any).input,
    path,
    languageNodes,
  });
};

const findChunks = ({ node, code, path, languageNodes }: findChunksParams) => {
  const MAX_CHUNK_SIZE: number = 1000;
  let chunkArray: any = [];
  let checkDuplicates: string[] = [];
  let tempChunks: string = "";
  let tempChunkLength: number = 0;

  // RECURSIVE FUNCTION TO LOOK FOR NODES OF INTEREST AND RETURN CHUNKS.

  const getChunks = (node: any, depth: number = 0) => {
    const listAllowedNodeTypes = languageNodes || [""];

    if (listAllowedNodeTypes.includes(node.type)) {
      // GET THE CHUNK
      const startPosition = node.startPosition;
      const endPosition = node.endPosition;
      const chunk = code
        .split("\n")
        .slice(startPosition.row, endPosition.row + 1);
      const chunkCode = chunk.join("\n");

      // CHECK IF CHUNK IS TOO LONG, IF SO, GO ONE LEVEL DEEPER.
      if (chunkCode.length > MAX_CHUNK_SIZE) {
        for (let i = 0; i < node.childCount; i++) {
          const child = node.child(i);
          getChunks(child, depth + 1);
        }
      } else {
        // CHECK IF CHUNK IS DUPLICATE
        if (!checkDuplicates.includes(chunkCode)) {
          checkDuplicates.push(chunkCode);
          // IF CHUNK IS LARGE THAN 500 CHARACTERS, ADD IT TO THE CHUNK ARRAY.
          if (tempChunkLength > 500) {
            chunkArray.push({
              data: tempChunks,
              file_name: path,
            });
            tempChunks = "";
            tempChunkLength = 0;
            // IF IT IS SMALLER THAN 500, ADD IT TO tempChunks.
          } else {
            tempChunkLength += chunkCode.length;
            tempChunks = `${tempChunks}\n${chunkCode}`;
          }
        }
      }
    }

    // ITERATE THROUGH EACH CHILD OF THE NODE.
    for (let i = 0; i < node.childCount; i++) {
      const child = node.child(i);
      getChunks(child, depth + 1);
    }
  };

  tempChunks = "";
  tempChunkLength = 0;

  // CALL RECURSIVE FUNCTION TO GET ALL CHUNKS.
  getChunks(node.rootNode);

  // CHECK IF CHUNKS WERE FOUND IN A FILE BUT ARE UNDER 500 CHARACTERS AFTER THE ENTIRE FILE WAS TRAVERSED.
  if (tempChunks.length > 0) {
    chunkArray.push({
      data: tempChunks,
      file_name: path,
    });
  }

  // RETURN ALL OF THE CHUNKS FROM THE PROVIDED FILE.
  const chunkFileObject = {
    file_path: path,
    data_chunks: chunkArray,
  };

  return chunkFileObject;
  // return node.rootNode;
};

export default chunkFile;
